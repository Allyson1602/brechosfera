import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Baazar } from "@/lib/graphql/generated";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const CTRL_GESTURE_MESSAGE = "Use Ctrl + arraste ou scroll para interagir com o mapa.";
const TOUCH_GESTURE_MESSAGE = "Use dois dedos para mover o mapa.";
const DF_BOUNDS: L.LatLngBoundsExpression = [
  [-15.93, -48.15],
  [-15.65, -47.75],
];

interface BusinessMapProps {
  businesses: Baazar[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onBusinessClick?: (business: Baazar) => void;
  selectedBusinessId?: string;
  className?: string;
  showUserLocation?: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

function hasCoarsePointer() {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
}

export function BusinessMap({
  businesses,
  center,
  zoom = 13,
  onBusinessClick,
  selectedBusinessId,
  className = "",
  showUserLocation = false,
  userLocation = null,
}: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const gestureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showGestureHintRef = useRef<(message: string) => void>(() => undefined);
  const [gestureHint, setGestureHint] = useState<string | null>(null);

  showGestureHintRef.current = (message: string) => {
    setGestureHint(message);

    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }

    gestureTimeoutRef.current = setTimeout(() => {
      setGestureHint(null);
      gestureTimeoutRef.current = null;
    }, 1800);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const touchDevice = hasCoarsePointer();
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      boxZoom: false,
      doubleClickZoom: false,
    });

    mapInstanceRef.current = map;

    if (touchDevice) {
      map.getContainer().style.touchAction = "pan-x pan-y";
    }

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    map.fitBounds(DF_BOUNDS);

    return () => {
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
        gestureTimeoutRef.current = null;
      }

      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const container = map.getContainer();
    const touchDevice = hasCoarsePointer();

    const disableDesktopInteractions = () => {
      if (touchDevice) return;
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      container.style.cursor = "grab";
    };

    const enableDesktopInteractions = () => {
      if (touchDevice) return;
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      container.style.cursor = "grabbing";
    };

    const disableTouchInteractions = () => {
      if (!touchDevice) return;
      map.dragging.disable();
      map.touchZoom.disable();
      container.style.touchAction = "pan-x pan-y";
    };

    const enableTouchInteractions = () => {
      if (!touchDevice) return;
      map.dragging.enable();
      map.touchZoom.enable();
      container.style.touchAction = "none";
    };

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) {
        disableDesktopInteractions();
        showGestureHintRef.current(CTRL_GESTURE_MESSAGE);
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (touchDevice || event.ctrlKey) return;

      disableDesktopInteractions();
      showGestureHintRef.current(CTRL_GESTURE_MESSAGE);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (touchDevice) return;
      if (event.key === "Control") {
        enableDesktopInteractions();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (touchDevice) return;
      if (event.key === "Control") {
        disableDesktopInteractions();
      }
    };

    const handleWindowBlur = () => {
      if (touchDevice) {
        disableTouchInteractions();
        return;
      }

      disableDesktopInteractions();
    };

    const updateTouchInteractions = (touchCount: number) => {
      if (!touchDevice) return;

      if (touchCount >= 2) {
        enableTouchInteractions();
        return;
      }

      disableTouchInteractions();
    };

    const handleTouchStart = (event: TouchEvent) => {
      updateTouchInteractions(event.touches.length);

      if (event.touches.length < 2) {
        showGestureHintRef.current(TOUCH_GESTURE_MESSAGE);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      updateTouchInteractions(event.touches.length);

      if (event.touches.length < 2) {
        disableTouchInteractions();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      updateTouchInteractions(event.touches.length);
    };

    const handleTouchCancel = () => {
      updateTouchInteractions(0);
    };

    disableDesktopInteractions();
    disableTouchInteractions();

    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchCancel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);

      disableDesktopInteractions();
      disableTouchInteractions();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedBusinessId && center) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
        animate: true,
      });
    }
  }, [selectedBusinessId, center, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    businesses
      .filter((b) => !b.isOnline && b.address)
      .forEach((business) => {
        if (!business.address) return;

        const isSelected = business.id === selectedBusinessId;

        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-10 h-10 rounded-full ${
                isSelected ? "bg-primary scale-125" : "bg-accent-foreground"
              } flex items-center justify-center shadow-lg transition-transform hover:scale-110" style="background-color: hsl(333, 71%, 50%);">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div class="absolute -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent" style="border-top-color: hsl(333, 71%, 50%);"></div>
            </div>
          `,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
        });

        const marker = L.marker(
          [business.locationMap.latitude, business.locationMap.longitude],
          { icon: customIcon },
        ).addTo(mapInstanceRef.current!);

        marker.bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-foreground">${business.name}</h3>
            <p class="text-sm text-muted-foreground">${business.address}</p>
          </div>
        `);

        marker.on("click", () => {
          onBusinessClick?.(business);
        });

        markersRef.current.push(marker);
      });
  }, [businesses, selectedBusinessId, onBusinessClick]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (showUserLocation && userLocation) {
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-blue-500 border-3 border-white shadow-lg flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div class="absolute w-12 h-12 rounded-full bg-blue-500/20 animate-ping"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapInstanceRef.current);
    }
  }, [showUserLocation, userLocation]);

  return (
    <div
      className={`relative h-full min-h-[280px] w-full overflow-hidden rounded-lg sm:min-h-[360px] lg:min-h-0 ${className}`}
      style={{ zIndex: 0 }}
    >
      <div ref={mapRef} className="h-full w-full" />
      {gestureHint ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-background/95 px-4 py-2 text-sm font-medium text-foreground shadow-lg">
          {gestureHint}
        </div>
      ) : null}
    </div>
  );
}

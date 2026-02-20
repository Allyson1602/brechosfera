import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Business } from "@/types/business";
import { appConfig } from "@/config/app.config";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Baazar } from "@/lib/graphql/generated";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface BusinessMapProps {
  businesses: Baazar[];
  center?: { lat: number; lng: number }; // Nota: Ignoraremos isso se não for uma loja
  zoom?: number;
  onBusinessClick?: (business: Baazar) => void;
  selectedBusinessId?: string;
  className?: string;
  showUserLocation?: boolean;
  userLocation?: { lat: number; lng: number } | null;
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

  // Limites geográficos do DF para o fitBounds
  const dfBounds: L.LatLngBoundsExpression = [
    [-15.93, -48.15], // Canto Inferior Esquerdo
    [-15.65, -47.75], // Canto Superior Direito
  ];

  // 1. INICIALIZAÇÃO (Roda apenas uma vez)
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current);

    // Tile Layer Clean
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(mapInstanceRef.current);

    // FORÇA O MAPA A INICIAR VENDO TODO O DF
    // Ignoramos qualquer 'center' inicial que possa ser a localização do usuário
    mapInstanceRef.current.fitBounds(dfBounds);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. CONTROLE DE CÂMERA (A Regra de Ouro)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // SÓ move a câmera se houver explicitamente uma LOJA SELECIONADA.
    // Se selectedBusinessId for nulo, ignoramos atualizações do 'center' (que viriam do GPS).
    if (selectedBusinessId && center) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
        animate: true,
      });
    }
    // Opcional: Se desejar que ao DESELECIONAR uma loja o mapa volte pro geral:
    // else if (!selectedBusinessId) {
    //    mapInstanceRef.current.fitBounds(dfBounds);
    // }
  }, [selectedBusinessId, center, zoom]);

  // 3. MARCADORES DAS LOJAS
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

  // 4. MARCADOR DO USUÁRIO (Bolinha Azul)
  // Atualiza a posição do pino, mas NUNCA chama setView/fitBounds
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

      // Apenas cria/move o marcador
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapInstanceRef.current);

      // NÃO chamamos setView aqui.
    }
  }, [showUserLocation, userLocation]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full min-h-[400px] rounded-lg ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRating, formatTimeRemaining } from "@/hooks/useRating";
import {
  GET_LOCAL_BAAZARS,
  GET_ONLINE_BAAZARS,
} from "@/lib/graphql/queries/business";
import { UPDATE_BAAZAR } from "@/lib/graphql/mutations/business";
import { toast } from "sonner";

interface RatingInputProps {
  businessId: string;
  businessName: string;
}

export function RatingInput({ businessId, businessName }: RatingInputProps) {
  const { canRate, timeUntilCanRate, registerRating, userRating } =
    useRating(businessId);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(userRating ?? 0);
  const [updateBaazar, { loading }] = useMutation(UPDATE_BAAZAR, {
    refetchQueries: [GET_LOCAL_BAAZARS, GET_ONLINE_BAAZARS],
    awaitRefetchQueries: false,
  });

  useEffect(() => {
    setSelectedRating(userRating ?? 0);
  }, [businessId, userRating]);

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      toast.error("Selecione uma avaliacao");
      return;
    }

    if (!canRate) {
      toast.error(
        "Voce ja avaliou uma loja recentemente. Tente novamente mais tarde.",
      );
      return;
    }

    const numericBusinessId = Number(businessId);
    if (!Number.isFinite(numericBusinessId)) {
      toast.error(
        "Nao foi possivel identificar a loja para registrar a avaliacao.",
      );
      return;
    }

    if (!canRate) {
      toast.error(
        "Você já avaliou uma loja recentemente. Tente novamente mais tarde.",
      );
      return;
    }

    const numericBusinessId = Number(businessId);
    if (!Number.isFinite(numericBusinessId)) {
      toast.error(
        "Não foi possível identificar a loja para registrar a avaliação.",
      );
      return;
    }

    try {
      await updateBaazar({
        variables: {
          updateBaazarInput: {
            id: numericBusinessId,
            newEvaluation: selectedRating,
          },
        },
      });

      registerRating(selectedRating);
      toast.success(
        `Voce avaliou ${businessName} com ${selectedRating} estrela${
          selectedRating > 1 ? "s" : ""
        }!`,
      );
    } catch {
      toast.error("Não foi possível salvar sua avaliação agora.");
    }
  };

  const displayRating = hoveredStar ?? selectedRating;
  const isBlockedByCurrentBusiness = !canRate && userRating !== null;
  const isBlockedByAnotherBusiness = !canRate && userRating === null;

  if (isBlockedByCurrentBusiness) {
    return (
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Sua avaliacao:</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= userRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            Poderá avaliar qualquer loja novamente em{" "}
            {formatTimeRemaining(timeUntilCanRate)}
          </span>
        </div>
      </div>
    );
  }

  if (isBlockedByAnotherBusiness) {
    return (
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium mb-2">
          Avaliação indisponível no momento
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            Você poderá avaliar qualquer loja novamente em{" "}
            {formatTimeRemaining(timeUntilCanRate)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-sm font-medium mb-3">Avalie esta loja</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-0.5 transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => setSelectedRating(star)}
              disabled={loading}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= displayRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30 hover:text-yellow-400/50"
                }`}
              />
            </button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => void handleSubmitRating()}
          disabled={selectedRating === 0 || loading}
        >
          {loading ? "Salvando..." : "Avaliar"}
        </Button>
      </div>
    </div>
  );
}

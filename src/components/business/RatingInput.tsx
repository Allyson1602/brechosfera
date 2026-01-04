import { useState } from 'react';
import { Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRating, formatTimeRemaining } from '@/hooks/useRating';
import { toast } from 'sonner';

interface RatingInputProps {
  businessId: string;
  businessName: string;
}

export function RatingInput({ businessId, businessName }: RatingInputProps) {
  const { canRate, timeUntilCanRate, submitRating, userRating } = useRating(businessId);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(userRating ?? 0);

  const handleSubmitRating = () => {
    if (selectedRating === 0) {
      toast.error('Selecione uma avaliação');
      return;
    }

    const success = submitRating(selectedRating);
    if (success) {
      toast.success(`Você avaliou ${businessName} com ${selectedRating} estrela${selectedRating > 1 ? 's' : ''}!`);
    } else {
      toast.error('Você já avaliou recentemente. Tente novamente mais tarde.');
    }
  };

  const displayRating = hoveredStar ?? selectedRating;

  if (!canRate && userRating !== null) {
    return (
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Sua avaliação:</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= userRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Poderá avaliar novamente em {formatTimeRemaining(timeUntilCanRate)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-sm font-medium mb-3">Avalie este estabelecimento</p>
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
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/30 hover:text-yellow-400/50'
                }`}
              />
            </button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={handleSubmitRating}
          disabled={selectedRating === 0}
        >
          Avaliar
        </Button>
      </div>
    </div>
  );
}

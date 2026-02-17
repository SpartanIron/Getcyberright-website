import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, TrendingUp, Clock } from "lucide-react";

interface ProgressCelebrationProps {
  completedCount: number;
  totalCount: number;
  inProgressCount: number;
}

export function ProgressCelebration({ completedCount, totalCount, inProgressCount }: ProgressCelebrationProps) {
  if (completedCount === 0) return null;

  const remaining = Math.max(0, totalCount - completedCount - inProgressCount);
  const estimatedTimeSavedMinutes = completedCount * 15;
  const hours = Math.floor(estimatedTimeSavedMinutes / 60);
  const minutes = estimatedTimeSavedMinutes % 60;
  const timeSavedDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      data-testid="card-progress-celebration"
    >
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0"
            >
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground" data-testid="text-celebration-title">
                {completedCount} removal{completedCount !== 1 ? "s" : ""} confirmed
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your personal data has been successfully removed from {completedCount} data broker{completedCount !== 1 ? "s" : ""}. Your digital footprint is shrinking.
              </p>
            </div>
            <Badge variant="default" data-testid="badge-progress-percent">
              {progressPercent}%
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-3 rounded-md bg-muted/50"
            >
              <Shield className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-lg font-bold text-foreground" data-testid="text-brokers-contacted">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Brokers contacted</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-3 rounded-md bg-muted/50"
            >
              <TrendingUp className="h-4 w-4 mx-auto mb-1.5 text-green-600 dark:text-green-400" />
              <p className="text-lg font-bold text-green-600 dark:text-green-400" data-testid="text-confirmed-removals">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Confirmed removals</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center p-3 rounded-md bg-muted/50"
            >
              <Clock className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-lg font-bold text-foreground" data-testid="text-time-saved">{timeSavedDisplay}</p>
              <p className="text-xs text-muted-foreground">Time saved</p>
            </motion.div>
          </div>

          {remaining > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between gap-3 pt-2 border-t"
            >
              <p className="text-sm text-muted-foreground">
                {remaining} broker{remaining !== 1 ? "s" : ""} remaining
                {inProgressCount > 0 && <span> ({inProgressCount} in progress)</span>}
              </p>
              <Button size="sm" data-testid="button-keep-going">
                Keep going
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

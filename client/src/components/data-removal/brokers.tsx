import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Database,
  Globe,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  AlertTriangle,
  User,
} from "lucide-react";
import type { DataBroker } from "@/components/data-removal/types";
import { getDifficultyVariant, getRiskVariant } from "@/components/data-removal/utils";

export function BrokerDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(0);
  const [expandedBrokerId, setExpandedBrokerId] = useState<string | null>(null);
  const limit = 20;

  const queryParams = new URLSearchParams();
  if (category && category !== "all") queryParams.set("category", category);
  if (difficulty && difficulty !== "all") queryParams.set("difficulty", difficulty);
  if (searchQuery) queryParams.set("search", searchQuery);
  queryParams.set("limit", String(limit));
  queryParams.set("offset", String(page * limit));

  const { data: brokersData, isLoading } = useQuery<{ brokers: DataBroker[]; total: number }>({
    queryKey: ["/api/data-removal/brokers", `?${queryParams.toString()}`],
  });

  const brokers = brokersData?.brokers || [];
  const total = brokersData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Broker Database
            </CardTitle>
            <CardDescription>
              Browse and search our catalog of {total > 0 ? `${total}+` : ""} known data broker sites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    data-testid="input-broker-search"
                    placeholder="Search brokers..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-[160px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v);
                    setPage(0);
                  }}
                  data-testid="select-broker-category"
                >
                  <SelectTrigger data-testid="select-broker-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="people-search">People Search</SelectItem>
                    <SelectItem value="data-broker">Data Broker</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="background-check">Background Check</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="public-records">Public Records</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[140px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => {
                    setDifficulty(v);
                    setPage(0);
                  }}
                  data-testid="select-broker-difficulty"
                >
                  <SelectTrigger data-testid="select-broker-difficulty">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brokers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No brokers found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brokers.map((broker, index) => (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card data-testid={`card-broker-${broker.id}`}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{broker.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {broker.domain}
                        </p>
                      </div>
                      {broker.riskLevel && (
                        <Badge variant={getRiskVariant(broker.riskLevel)} className="capitalize">
                          {broker.riskLevel}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="capitalize">{broker.category}</Badge>
                      <Badge variant={getDifficultyVariant(broker.difficulty)} className="capitalize">
                        {broker.difficulty}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{broker.optOutMethod}</Badge>
                    </div>

                    {broker.dataTypesCollected && broker.dataTypesCollected.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Collects: {broker.dataTypesCollected.slice(0, 4).join(", ")}
                        {broker.dataTypesCollected.length > 4 && ` +${broker.dataTypesCollected.length - 4} more`}
                      </p>
                    )}

                    {broker.estimatedProcessingDays && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Est. {broker.estimatedProcessingDays} days to process
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedBrokerId(expandedBrokerId === broker.id ? null : broker.id)
                        }
                      >
                        <ChevronDown
                          className={`h-4 w-4 mr-1 transition-transform ${expandedBrokerId === broker.id ? "rotate-180" : ""}`}
                        />
                        Details
                      </Button>
                      {broker.optOutUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={broker.optOutUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Opt-Out Page
                          </a>
                        </Button>
                      )}
                    </div>

                    {expandedBrokerId === broker.id && (
                      <div className="border-t pt-3 mt-2 space-y-2">
                        {broker.description && (
                          <p className="text-sm text-muted-foreground">{broker.description}</p>
                        )}
                        {broker.optOutInstructions && (
                          <div>
                            <p className="text-xs font-medium mb-1">Opt-Out Instructions:</p>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {broker.optOutInstructions}
                            </p>
                          </div>
                        )}
                        {broker.optOutEmail && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {broker.optOutEmail}
                          </p>
                        )}
                        <div className="flex gap-3 flex-wrap text-xs text-muted-foreground">
                          {broker.requiresIdVerification && (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Requires ID Verification
                            </span>
                          )}
                          {broker.requiresAccountCreation && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Requires Account
                            </span>
                          )}
                          {broker.parentCompany && (
                            <span>Parent: {broker.parentCompany}</span>
                          )}
                          {broker.monthlyVisitors && (
                            <span>Visitors: {broker.monthlyVisitors}/mo</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

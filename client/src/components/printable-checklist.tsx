"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, CheckCircle2, Circle } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  priority?: "critical" | "important" | "recommended";
}

interface PrintableChecklistProps {
  title: string;
  description?: string;
  items: ChecklistItem[];
  category?: string;
}

export function PrintableChecklist({ title, description, items, category, id }: PrintableChecklistProps & { id?: string }) {
  const checklistId = id || category?.toLowerCase().replace(/\s+/g, '-') || 'default';
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const handlePrint = () => {
    window.print();
  };

  const completedCount = checkedItems.size;
  const totalCount = items.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const priorityColors = {
    critical: "text-destructive",
    important: "text-accent",
    recommended: "text-muted-foreground",
  };

  return (
    <Card className="print:shadow-none print:border-none" data-testid={`printable-checklist-${checklistId}`}>
      <CardHeader className="print:pb-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            {category && (
              <Badge variant="outline" className="mb-2 print:hidden">
                {category}
              </Badge>
            )}
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="print:hidden shrink-0"
            data-testid={`button-print-checklist-${checklistId}`}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        <div className="mt-4 print:hidden">
          <div className="flex items-center justify-between gap-2 text-sm mb-2">
            <span className="text-muted-foreground">
              {completedCount} of {totalCount} completed
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 print:space-y-2">
          {items.map((item) => {
            const isChecked = checkedItems.has(item.id);
            return (
              <li
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors print:border-none print:p-1 ${
                  isChecked ? "bg-muted/50 border-muted" : "border-border"
                }`}
              >
                <Checkbox
                  id={`${checklistId}-${item.id}`}
                  checked={isChecked}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-0.5 print:hidden"
                  data-testid={`checkbox-${checklistId}-${item.id}`}
                />
                <div className="hidden print:block mt-0.5">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <label
                  htmlFor={`${checklistId}-${item.id}`}
                  className={`flex-1 text-sm cursor-pointer ${
                    isChecked ? "line-through text-muted-foreground" : ""
                  }`}
                  data-testid={`label-${checklistId}-${item.id}`}
                >
                  {item.priority && (
                    <span
                      className={`font-medium mr-2 ${priorityColors[item.priority]} print:hidden`}
                    >
                      [{item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}]
                    </span>
                  )}
                  {item.text}
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-4 border-t print:hidden">
          <p className="text-xs text-muted-foreground text-center">
            GetCyberRight.com - Free Cybersecurity Education
          </p>
        </div>

        <div className="hidden print:block mt-4 pt-2 border-t text-xs text-center">
          <p>GetCyberRight.com - Printed Checklist</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export { securityChecklists } from "@/data/security-checklists";

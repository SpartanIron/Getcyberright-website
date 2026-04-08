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

export const securityChecklists = {
  homeNetwork: {
    title: "Home Network Security Checklist",
    description: "Essential steps to secure your home WiFi and connected devices",
    category: "Home Security",
    items: [
      { id: "router-password", text: "Change your router's default admin password", priority: "critical" as const },
      { id: "wifi-password", text: "Use a strong, unique WiFi password (at least 12 characters)", priority: "critical" as const },
      { id: "wpa3", text: "Enable WPA3 encryption (or WPA2 if WPA3 unavailable)", priority: "critical" as const },
      { id: "firmware", text: "Update your router's firmware to the latest version", priority: "important" as const },
      { id: "guest-network", text: "Set up a separate guest network for visitors", priority: "important" as const },
      { id: "remote-access", text: "Disable remote management if not needed", priority: "important" as const },
      { id: "device-names", text: "Rename your network to not reveal personal info", priority: "recommended" as const },
      { id: "connected-devices", text: "Review and remove unknown connected devices", priority: "recommended" as const },
    ],
  },
  accountSecurity: {
    title: "Account Security Checklist",
    description: "Protect your online accounts from unauthorized access",
    category: "Personal Security",
    items: [
      { id: "unique-passwords", text: "Use unique passwords for every account", priority: "critical" as const },
      { id: "2fa", text: "Enable two-factor authentication on all important accounts", priority: "critical" as const },
      { id: "password-manager", text: "Use a reputable password manager", priority: "critical" as const },
      { id: "breach-check", text: "Check if your email has been in a data breach", priority: "important" as const },
      { id: "recovery-options", text: "Set up account recovery options (phone, backup email)", priority: "important" as const },
      { id: "security-questions", text: "Use unique answers for security questions", priority: "important" as const },
      { id: "login-alerts", text: "Enable login notifications where available", priority: "recommended" as const },
      { id: "old-accounts", text: "Close accounts you no longer use", priority: "recommended" as const },
    ],
  },
  familySafety: {
    title: "Family Online Safety Checklist",
    description: "Keep your family safe from online threats",
    category: "Family",
    items: [
      { id: "parental-controls", text: "Set up parental controls on devices and apps", priority: "critical" as const },
      { id: "discuss-safety", text: "Have regular conversations about online safety", priority: "critical" as const },
      { id: "screen-time", text: "Establish screen time limits and boundaries", priority: "important" as const },
      { id: "privacy-settings", text: "Review privacy settings on social media accounts", priority: "important" as const },
      { id: "stranger-danger", text: "Teach children not to share personal info online", priority: "critical" as const },
      { id: "trusted-adult", text: "Ensure kids know to report uncomfortable situations", priority: "critical" as const },
      { id: "app-review", text: "Regularly review installed apps on family devices", priority: "important" as const },
      { id: "location-sharing", text: "Check and manage location sharing settings", priority: "recommended" as const },
    ],
  },
  smallBusiness: {
    title: "Small Business Security Checklist",
    description: "Essential security measures for your business",
    category: "Business",
    items: [
      { id: "employee-training", text: "Provide cybersecurity training to all employees", priority: "critical" as const },
      { id: "backup-data", text: "Implement regular data backup procedures", priority: "critical" as const },
      { id: "access-control", text: "Limit access to sensitive data on a need-to-know basis", priority: "critical" as const },
      { id: "software-updates", text: "Keep all software and systems updated", priority: "critical" as const },
      { id: "email-security", text: "Use email filtering and anti-phishing tools", priority: "important" as const },
      { id: "incident-plan", text: "Create an incident response plan", priority: "important" as const },
      { id: "vendor-security", text: "Review security practices of third-party vendors", priority: "important" as const },
      { id: "cyber-insurance", text: "Consider cybersecurity insurance", priority: "recommended" as const },
    ],
  },
};

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { FileText, Download, Trash2, ExternalLink } from "lucide-react";

interface DocumentCardProps {
  document: {
    id: string;
    filename: string;
    vertical: string;
    status: "Processing" | "Ready" | "Review" | "Exported" | "Error";
    createdAt: string;
  };
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const handleOpen = () => {
    console.log("Opening document:", document.id);
  };

  const handleExport = () => {
    console.log("Exporting document:", document.id);
  };

  const handleDelete = () => {
    console.log("Deleting document:", document.id);
  };

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-1 flex-shrink-0">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-sm font-medium truncate mb-1">
                {document.filename}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {document.vertical}
                </Badge>
                <StatusBadge status={document.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          Created {document.createdAt}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleOpen}
            className="flex-1"
            disabled={document.status === "Processing"}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            disabled={document.status === "Processing" || document.status === "Error"}
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

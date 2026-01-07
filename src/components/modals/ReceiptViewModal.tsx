import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { ReceiptDocument } from "@/components/receipt/ReceiptDocument";
import { Receipt } from "@/hooks/useReceipts";
import { toast } from "sonner";

interface ReceiptViewModalProps {
  receipt: Receipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptViewModal({ receipt, open, onOpenChange }: ReceiptViewModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Não foi possível abrir a janela de impressão. Verifique se popups estão habilitados.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recibo ${receipt?.receipt_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            @media print {
              @page { size: A5 landscape; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          ${receiptRef.current.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = async () => {
    if (!receiptRef.current || !receipt) return;

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Não foi possível gerar o PDF. Verifique se popups estão habilitados.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Recibo ${receipt.receipt_number}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; }
              @media print {
                @page { size: A5 landscape; margin: 10mm; }
              }
            </style>
          </head>
          <body>
            ${receiptRef.current.outerHTML}
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
      toast.success("Use 'Salvar como PDF' na janela de impressão para baixar o recibo.");
    } catch (error) {
      toast.error("Erro ao gerar o download do recibo.");
    }
  };

  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between font-display text-xl">
            <span>Recibo {receipt.receipt_number}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="border rounded-lg overflow-auto bg-gray-100 p-4">
          <ReceiptDocument ref={receiptRef} receipt={receipt} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

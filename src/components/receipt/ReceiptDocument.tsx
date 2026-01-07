import { forwardRef } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReceiptDocumentProps {
  receipt: {
    receipt_number: string;
    student_name: string;
    description: string;
    amount: number;
    date: string;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const numberToWords = (num: number): string => {
  const units = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const tens = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const hundreds = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  if (num === 0) return "zero";
  if (num === 100) return "cem";

  let words = "";

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    if (thousands === 1) {
      words += "mil";
    } else {
      words += units[thousands] + " mil";
    }
    num %= 1000;
    if (num > 0) words += " e ";
  }

  if (num >= 100) {
    words += hundreds[Math.floor(num / 100)];
    num %= 100;
    if (num > 0) words += " e ";
  }

  if (num >= 20) {
    words += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) words += " e ";
  } else if (num >= 10) {
    words += teens[num - 10];
    return words;
  }

  if (num > 0) {
    words += units[num];
  }

  return words;
};

const amountToWords = (amount: number): string => {
  const intPart = Math.floor(amount);
  const decPart = Math.round((amount - intPart) * 100);
  
  let result = numberToWords(intPart) + " reais";
  
  if (decPart > 0) {
    result += " e " + numberToWords(decPart) + " centavos";
  }
  
  return result;
};

export const ReceiptDocument = forwardRef<HTMLDivElement, ReceiptDocumentProps>(
  ({ receipt }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white p-8 text-black"
        style={{ width: "210mm", minHeight: "148mm", fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wider">Recibo de Pagamento</h1>
            <p className="text-sm text-gray-600 mt-1">Nº {receipt.receipt_number}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="flex justify-end mb-6">
          <div className="border-2 border-gray-800 px-6 py-3 rounded">
            <p className="text-2xl font-bold">{formatCurrency(Number(receipt.amount))}</p>
          </div>
        </div>

        {/* Body */}
        <div className="mb-8 text-base leading-relaxed">
          <p className="mb-4">
            Recebi de <strong className="uppercase">{receipt.student_name}</strong> a importância de{" "}
            <strong>{amountToWords(Number(receipt.amount))}</strong> referente a:
          </p>
          <p className="border-b border-gray-400 pb-2 mb-4 font-medium">
            {receipt.description}
          </p>
        </div>

        {/* Date and Signature */}
        <div className="mt-12">
          <p className="text-right mb-12">
            {format(parseISO(receipt.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          
          <div className="flex justify-center mt-16">
            <div className="text-center">
              <div className="border-t border-gray-800 w-64 mb-2"></div>
              <p className="text-sm">Assinatura</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-500 text-center">
            Este recibo é válido como comprovante de pagamento.
          </p>
        </div>
      </div>
    );
  }
);

ReceiptDocument.displayName = "ReceiptDocument";

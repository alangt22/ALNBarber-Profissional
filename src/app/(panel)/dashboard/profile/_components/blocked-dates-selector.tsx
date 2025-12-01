"use client";

import { ptBR } from "date-fns/locale";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  initialDates?: string[]; // ["2025-11-28", ...]
  onChange: (dates: string[]) => void;
}

// Ajusta a data para 12:00 para evitar bugs de timezone
function normalizePickerDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
}

// Formata Date para "YYYY-MM-DD"
function formatISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function BlockedDatesSelector({ initialDates = [], onChange }: Props) {
  const [blocked, setBlocked] = useState<string[]>(
    Array.from(new Set(initialDates))
  );

  const [pickerDate, setPickerDate] = useState<Date | null>(null);

  function addDate(date: Date | null) {
    if (!date) return;

    const iso = formatISO(date);

    if (!blocked.includes(iso)) {
      const next = [...blocked, iso].sort();
      setBlocked(next);
      onChange(next);
    }
  }

  function removeDate(iso: string) {
    const next = blocked.filter((d) => d !== iso);
    setBlocked(next);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div>
        <DatePicker
          locale={ptBR}
          selected={pickerDate}
          onChange={(d) => {
            if (!d) return;

            // 👇 Aqui é onde acontece a correção definitiva
            const safeDate = normalizePickerDate(d as Date);

            setPickerDate(safeDate);
            addDate(safeDate);
          }}
          inline
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {blocked.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Nenhuma data bloqueada
          </div>
        ) : (
          blocked.map((iso) => {
            const [y, m, d] = iso.split("-");
            const readable = `${d}/${m}/${y}`;

            return (
              <div
                key={iso}
                className="flex items-center space-x-2 bg-gray-500 text-white px-3 py-1 rounded"
              >
                <span className="text-sm">{readable}</span>

                <button
                  type="button"
                  onClick={() => removeDate(iso)}
                  className="ml-2 text-xs text-red-400 cursor-pointer hover:scale-110"
                >
                  Remover
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

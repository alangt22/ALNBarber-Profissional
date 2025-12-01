// components/date-picker.tsx
"use client";
import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

interface DateTimePickerProps {
  className?: string;
  initialDate?: Date;
  onChange: (date: Date) => void;
  allowedDays?: number[]; // 0 = domingo ... 6 = sábado
  blockedDates?: (string | Date)[];
}

export function DateTimePicker({
  className,
  initialDate,
  onChange,
  allowedDays,
  blockedDates,
}: DateTimePickerProps) {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // converte ISO/string/Date para YYYY-MM-DD no timezone local
 function toYMDLocal(input: string | Date) {
  if (typeof input === "string") {
    // caso venha "2025-11-29T03:00:00.000Z" ou "2025-11-29T00:00:00.000Z"
    if (input.includes("T")) {
      return input.slice(0, 10); // pega YYYY-MM-DD direto, evita timezone shift
    }
    // caso já seja "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input;
    }
    // fallback: tenta criar Date (menos provável)
    const d = new Date(input);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  } else {
    // se já é Date, usa getters locais
    return `${input.getFullYear()}-${String(input.getMonth()+1).padStart(2,"0")}-${String(input.getDate()).padStart(2,"0")}`;
  }
}
  // normalized array memo (recalculado quando blockedDates muda)
  const [normalizedBlocked, setNormalizedBlocked] = useState<string[]>([]);

  useEffect(() => {
    if (!blockedDates) {
      setNormalizedBlocked([]);
     
      return;
    }
    const normalized = blockedDates.map((b) => toYMDLocal(b));
    setNormalizedBlocked(normalized);
 
  }, [blockedDates]);

  // cria set para lookup rápido
  const blockedSet = new Set(normalizedBlocked);

  function resetToMidnight(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // mínimo = HOJE, máximo = último dia do mês atual
  const computedMinDate = resetToMidnight(todayMidnight);
  const computedMaxDate = resetToMidnight(lastOfMonth);

  function clampToAllowed(d: Date) {
    const r = resetToMidnight(d);
    if (r < computedMinDate) return computedMinDate;
    if (r > computedMaxDate) return computedMaxDate;
    if (blockedSet.has(toYMDLocal(r))) return computedMinDate;
    return r;
  }

  const [startDate, setStartDate] = useState<Date>(
    initialDate ? clampToAllowed(initialDate) : clampToAllowed(new Date())
  );

  useEffect(() => {
    setStartDate((cur) => clampToAllowed(cur));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedBlocked]);

  function handleChange(date: Date | null) {
    if (date) {
      const resetDate = resetToMidnight(date);
      if (blockedSet.has(toYMDLocal(resetDate))) {
        console.warn("Tentativa de selecionar dia bloqueado:", toYMDLocal(resetDate));
        return;
      }
      setStartDate(resetDate);
      onChange(resetDate);
    }
  }

  return (
    <>
      <DatePicker
        className={className}
        selected={startDate}
        minDate={computedMinDate}
        maxDate={computedMaxDate}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        locale="pt-BR"
        filterDate={(date) => {
          const sameMonth =
            date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          if (!sameMonth) return false;

          // desabilita dias anteriores a hoje
          if (resetToMidnight(date) < computedMinDate) return false;

          // bloqueadas específicas (comparação em YYYY-MM-DD local)
          if (blockedSet.has(toYMDLocal(date))) return false;

          if (!allowedDays) return true;
          const day = date.getDay();
          return allowedDays.includes(day);
        }}
        dayClassName={(date) => (blockedSet.has(toYMDLocal(date)) ? "blocked-day" : "")}
        renderCustomHeader={({ date }) => {
          const month = date.toLocaleString("pt-BR", { month: "long" });
          const year = date.getFullYear();
          return (
            <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
              <div style={{ fontWeight: 600, textTransform: "capitalize" }}>
                {`${month} ${year}`}
              </div>
            </div>
          );
        }}
      />



      <style>{`
  .react-datepicker__day--outside-month { visibility: hidden; }

  .react-datepicker__day.blocked-day {
    background: rgba(220,38,38,0.12) !important;
    color: #ff6b6b !important;
    border-radius: 50%;
  }
  .react-datepicker__day.blocked-day:hover {
    background: rgba(220,38,38,0.18) !important;
  }

  .react-datepicker-wrapper input {
    background-color: #1f1f1f !important;
    color: white !important;
    border: 1px solid #3a3a3a !important;
  }

  .react-datepicker { background-color: #1f1f1f !important; border: 1px solid #3a3a3a !important; color: white !important; }
  .react-datepicker__header { background-color: #1f1f1f !important; border-bottom: 1px solid #3a3a3a !important; }
  .react-datepicker__day, .react-datepicker__day-name, .react-datepicker__current-month { color: white !important; }
  .react-datepicker__day--disabled { color: #777 !important; background-color: #2a2a2a !important; cursor: not-allowed; }
  .react-datepicker__day:not(.react-datepicker__day--disabled):hover { background-color: #333 !important; border-radius: 50%; }
  .react-datepicker__navigation { display: none !important; }
`}</style>
    </>
  );
}

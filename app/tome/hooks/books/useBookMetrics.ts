import { useMemo } from "react";
import dayjs from "dayjs";
import { BookApiEntity, BookEventApiEntity } from "@/app/api/books/types";
import { BookEventType } from "@/app/server/books/types";

interface Period {
  pageCount: number;
  currentPage: number;
  start: Date | null;
  end: Date | null;
}

interface PeriodAverage {
  avg: number;
  start: Date | null;
  end: Date | null;
}

interface ProgressEvent {
  dateEffective: Date;
  pageNumber: number;
}

export interface BookMetrics {
  totalDays: number;
  avgPagesPerDay: number;
  bestPeriod: PeriodAverage;
  periods: Period[];
  estimatedCompletion: dayjs.Dayjs | null;
  isCompleted: boolean;
  percentComplete: number;
  currentPage: number;
  progressEvents: ProgressEvent[];
}

export function useBookMetrics(
  events: BookEventApiEntity[] | null,
  book: BookApiEntity
): BookMetrics | null {
  return useMemo(() => {
    if (!events || events.length === 0) return null;

    // We need events in ascending order for logic, sorted by dateEffective then creationOrderId (both asc)
    // This ensures progress on the same day is displayed chronologically
    const sortedEvents = [...events].sort((a, b) => {
      const dateCompare =
        dayjs(a.dateEffective).valueOf() - dayjs(b.dateEffective).valueOf();
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return a.creationOrderId - b.creationOrderId;
    });

    const startEvent =
      sortedEvents.find(
        (e) =>
          e.eventType === BookEventType.STARTED ||
          e.eventType === BookEventType.PROGRESS
      ) || sortedEvents[0];

    const completedEvent = sortedEvents.find(
      (e) => e.eventType === BookEventType.COMPLETED
    );

    const startDate = dayjs(startEvent.dateEffective);
    const endDate = completedEvent
      ? dayjs(completedEvent.dateEffective)
      : dayjs();

    const totalDays = Math.max(1, endDate.diff(startDate, "day") + 1);

    const latestProgressEvent = [...sortedEvents]
      .reverse()
      .find((e) => e.pageNumber !== null);
    const currentPage = latestProgressEvent?.pageNumber || 0;

    const avgPagesPerDay = currentPage / totalDays;

    // Best Period calculation
    let bestPeriod: PeriodAverage = {
      avg: 0,
      start: null as Date | null,
      end: null as Date | null,
    };

    const periods: Period[] = [];

    for (let i = 1; i < sortedEvents.length; i++) {
      const prev = sortedEvents[i - 1];
      const curr = sortedEvents[i];

      if (prev.pageNumber === null || curr.pageNumber === null) continue;

      const days = Math.max(
        1,
        dayjs(curr.dateEffective).diff(dayjs(prev.dateEffective), "day")
      );
      const pages = curr.pageNumber - prev.pageNumber;

      if (pages <= 0) continue;

      const avg = pages / days;
      if (avg > bestPeriod.avg) {
        bestPeriod = {
          avg,
          start: prev.dateEffective,
          end: curr.dateEffective,
        };
      }

      periods.push({
        pageCount: pages,
        start: prev.dateEffective,
        end: curr.dateEffective,
        currentPage: curr.pageNumber,
      });
    }

    // Estimated Completion
    let estimatedCompletion = null;
    if (
      book.totalPages &&
      currentPage < book.totalPages &&
      avgPagesPerDay > 0 &&
      !completedEvent
    ) {
      const remainingPages = book.totalPages - currentPage;
      const daysRemaining = Math.ceil(remainingPages / avgPagesPerDay);
      estimatedCompletion = dayjs().add(daysRemaining, "day");
    }

    const progressEvents: ProgressEvent[] = sortedEvents
      .filter((e) => e.pageNumber !== null)
      .map((e) => ({
        dateEffective: e.dateEffective,
        pageNumber: e.pageNumber as number,
      }));

    return {
      totalDays,
      avgPagesPerDay,
      bestPeriod,
      periods,
      estimatedCompletion,
      isCompleted: !!completedEvent,
      percentComplete: book.totalPages
        ? (currentPage / book.totalPages) * 100
        : 0,
      currentPage,
      progressEvents,
    };
  }, [events, book.totalPages]);
}

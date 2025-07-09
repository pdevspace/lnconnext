// Service to access Bitcoin event data
import { Event } from "../types/event";
import { getAllBitcoinEvents } from "./mock-bitcoin-events";

export function getAllEvents(): Event[] {
  return getAllBitcoinEvents();
}

export function getEventById(id: string): Event | undefined {
  return getAllBitcoinEvents().find(event => event.id === id);
}

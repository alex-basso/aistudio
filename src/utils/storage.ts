import { Ride, Route, Participant } from '../types';
import { FARROUPILHA_ROUTES, getDefaultRides, DEFAULT_PARTICIPANTS, getUpcomingSaturdays } from '../data/defaultData';

export { getUpcomingSaturdays };

const STORAGE_KEYS = {
  RIDES: 'trilhas_farroupilha_rides',
  ROUTES: 'trilhas_farroupilha_routes',
  PARTICIPANTS: 'trilhas_farroupilha_participants',
};

export function loadRides(): Ride[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RIDES);
    if (!raw) {
      const defaults = getDefaultRides();
      localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultRides();
  }
}

export function saveRides(rides: Ride[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(rides));
  } catch (err) {
    console.error('Erro ao salvar passeios:', err);
  }
}

export function loadRoutes(): Route[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(FARROUPILHA_ROUTES));
      return FARROUPILHA_ROUTES;
    }
    return JSON.parse(raw);
  } catch {
    return FARROUPILHA_ROUTES;
  }
}

export function saveRoutes(routes: Route[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  } catch (err) {
    console.error('Erro ao salvar rotas:', err);
  }
}

export function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(DEFAULT_PARTICIPANTS));
      return DEFAULT_PARTICIPANTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PARTICIPANTS;
  }
}

export function saveParticipants(participants: Participant[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  } catch (err) {
    console.error('Erro ao salvar participantes:', err);
  }
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.RIDES);
  localStorage.removeItem(STORAGE_KEYS.ROUTES);
  localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
}

export function formatDatePtBr(dateStr: string): string {
  try {
    // dateStr is 'YYYY-MM-DD'
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);

    const weekDay = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const capitalizedWeekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    const dayFormatted = String(day).padStart(2, '0');
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });

    return `${capitalizedWeekDay}, ${dayFormatted} de ${monthName} de ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  } catch {
    return dateStr;
  }
}

export function generateWhatsAppBriefing(
  ride: Ride,
  route: Route,
  participants: Participant[],
  weatherAlert?: string
): string {
  const confirmed = participants.filter(
    (p) => p.presenceStatus === 'confirmado' || p.presenceStatus === 'presente'
  );

  let text = `🏍️ *TRILHAS FARROUPILHA - PASSEIO DE SÁBADO* 🏍️\n\n`;
  text += `🏁 *${ride.title.toUpperCase()}*\n`;
  text += `📅 *Data:* ${formatDatePtBr(ride.date)}\n`;
  text += `📍 *Ponto de Encontro:* ${ride.meetingPoint}\n`;
  text += `⏰ *Concentração:* ${ride.meetingTime} | 🚀 *Saída:* ${ride.departureTime}\n`;
  text += `⏱️ *Previsão de Chegada:* ${ride.arrivalTimeEstimated}\n\n`;

  if (weatherAlert) {
    text += `🌧️ *PREVISÃO DO TEMPO & ALERTA:*\n${weatherAlert}\n\n`;
  }

  text += `🗺️ *ROTA PROPOSTA DO DIA*\n`;
  text += `• *Roteiro:* ${route.name}\n`;
  text += `• *Região:* ${route.region}\n`;
  text += `• *Distância:* ${route.distanceKm} km | *Tempo est.:* ${route.durationEst}\n`;
  text += `• *Nível:* ${route.difficulty} | *Desnível:* +${route.elevationGainM}m\n`;
  text += `• *Piso:* ${route.terrain.join(', ')}\n\n`;

  if (route.waypoints && route.waypoints.length > 0) {
    text += `📍 *PARADAS & WAYPOINTS:*\n`;
    route.waypoints.forEach((wp) => {
      text += ` [${wp.timeSuggested}] ${wp.title} - ${wp.locationName}\n`;
    });
    text += `\n`;
  }

  text += `👥 *LISTA DE PILOTOS (${confirmed.length} CONFIRMADOS):*\n`;
  if (confirmed.length === 0) {
    text += `Nenhum piloto confirmado ainda.\n`;
  } else {
    confirmed.forEach((p, index) => {
      const bike = p.motorcycleModel ? ` - ${p.motorcycleModel}` : '';
      text += `${index + 1}. ${p.name}${bike} (${p.experienceLevel})\n`;
    });
  }

  text += `\n🛡️ *AVISOS & SEGURANÇA:*\n`;
  text += `• ${ride.briefingNotes || 'Tanque cheio, pneus conferidos e equipamentos completos.'}\n`;
  text += `• Em caso de emergência, os contatos cadastrados de cada piloto estão salvos com a organização.\n`;
  text += `• Vamos rodar com responsabilidade e respeito aos moradores das linhas de Farroupilha! ✊💨`;

  return text;
}

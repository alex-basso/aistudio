export type DifficultyLevel = 'Leve' | 'Média' | 'Difícil' | 'Hard Enduro';

export type ExperienceLevel = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Hard Enduro';

export type PresenceStatus = 'confirmado' | 'pendente' | 'presente' | 'cancelado';

export type RideStatus = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';

export type WaypointType = 'encontro' | 'trilha' | 'mirante' | 'combustivel' | 'almoco' | 'obstaculo' | 'chegada';

export interface Waypoint {
  id: string;
  order: number;
  title: string;
  type: WaypointType;
  timeSuggested: string;
  description: string;
  locationName: string;
  elevationM?: number;
}

export interface Route {
  id: string;
  name: string;
  slug: string;
  region: string;
  distanceKm: number;
  durationEst: string;
  difficulty: DifficultyLevel;
  terrain: string[];
  elevationGainM: number;
  description: string;
  waypoints: Waypoint[];
  imageUrl: string;
  isCustom?: boolean;
}

export interface Participant {
  id: string;
  rideId: string;
  name: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  experienceLevel: ExperienceLevel;
  motorcycleModel?: string;
  presenceStatus: PresenceStatus;
  createdAt: string;
  notes?: string;
}

export interface Ride {
  id: string;
  date: string; // YYYY-MM-DD (sempre com preferência para sábados)
  dayOfWeekName?: string;
  title: string;
  description: string;
  meetingPoint: string;
  meetingTime: string;
  departureTime: string;
  arrivalTimeEstimated: string;
  routeId: string;
  customRoute?: Route;
  status: RideStatus;
  briefingNotes: string;
  maxParticipants: number;
}

export interface WeatherForecastResult {
  city: string;
  state: string;
  date: string;
  temperatureMin: number;
  temperatureMax: number;
  precipitationProbability: number;
  precipitationMm: number;
  weatherDescription: string;
  hasHeavyRain: boolean;
  alertLevel: 'alerta_vermelho' | 'atencao_lama' | 'condicoes_ideais';
  alertTitle: string;
  alertMessage: string;
  recommendations: string[];
  searchSource: string;
  searchGroundingSources?: { title: string; url: string }[];
  updatedAt: string;
}


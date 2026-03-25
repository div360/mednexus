import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  Timestamp,
  type QuerySnapshot,
} from 'firebase/firestore';
import type { Patient, PatientFilterMetadata, PatientsQueryParams } from '@mednexus/shared/types';
import { db } from '@mednexus/shared/firebase';

const PATIENTS_COLLECTION = 'patients';

function toIsoString(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function mapDiagnosis(raw: unknown): Patient['diagnoses'][number] | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const d = raw as Record<string, unknown>;
  const id = typeof d.id === 'string' ? d.id : '';
  const condition = typeof d.condition === 'string' ? d.condition : '';
  const icdCode = typeof d.icdCode === 'string' ? d.icdCode : '';
  return {
    id,
    condition,
    icdCode,
    diagnosedAt: toIsoString(d.diagnosedAt),
    doctor: typeof d.doctor === 'string' ? d.doctor : '',
    ...(typeof d.notes === 'string' ? { notes: d.notes } : {}),
  };
}

function mapVitals(raw: unknown): Patient['vitals'] {
  if (!raw || typeof raw !== 'object') {
    return {
      bloodPressure: '—',
      heartRate: 0,
      temperature: 0,
      oxygenSaturation: 0,
      weight: 0,
      height: 0,
      recordedAt: new Date().toISOString(),
    };
  }
  const v = raw as Record<string, unknown>;
  return {
    bloodPressure: typeof v.bloodPressure === 'string' ? v.bloodPressure : '—',
    heartRate: typeof v.heartRate === 'number' ? v.heartRate : 0,
    temperature: typeof v.temperature === 'number' ? v.temperature : 0,
    oxygenSaturation:
      typeof v.oxygenSaturation === 'number' ? v.oxygenSaturation : 0,
    weight: typeof v.weight === 'number' ? v.weight : 0,
    height: typeof v.height === 'number' ? v.height : 0,
    recordedAt: toIsoString(v.recordedAt),
  };
}

function mapAppointment(raw: unknown): Patient['appointments'][number] | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const a = raw as Record<string, unknown>;
  const status = a.status;
  if (
    status !== 'upcoming' &&
    status !== 'completed' &&
    status !== 'cancelled'
  ) {
    return null;
  }
  return {
    id: typeof a.id === 'string' ? a.id : '',
    doctorName: typeof a.doctorName === 'string' ? a.doctorName : '',
    department: typeof a.department === 'string' ? a.department : '',
    scheduledAt: toIsoString(a.scheduledAt),
    status,
    ...(typeof a.notes === 'string' ? { notes: a.notes } : {}),
  };
}

function mapDocumentToPatient(
  docId: string,
  data: Record<string, unknown>
): Patient | null {
  const id = typeof data.id === 'string' ? data.id : docId;
  const firstName = typeof data.firstName === 'string' ? data.firstName : '';
  const lastName = typeof data.lastName === 'string' ? data.lastName : '';
  if (!firstName && !lastName) {
    return null;
  }

  const gender = data.gender;
  if (gender !== 'male' && gender !== 'female' && gender !== 'other') {
    return null;
  }

  const status = data.status;
  const validStatuses: Patient['status'][] = [
    'active',
    'discharged',
    'critical',
    'stable',
    'observation',
  ];
  if (!validStatuses.includes(status as Patient['status'])) {
    return null;
  }

  const bloodGroup = data.bloodGroup;
  const validBlood: Patient['bloodGroup'][] = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ];
  if (!validBlood.includes(bloodGroup as Patient['bloodGroup'])) {
    return null;
  }

  const diagnosesRaw = Array.isArray(data.diagnoses) ? data.diagnoses : [];
  const diagnoses = diagnosesRaw
    .map(mapDiagnosis)
    .filter((d): d is NonNullable<typeof d> => d !== null);

  const appointmentsRaw = Array.isArray(data.appointments)
    ? data.appointments
    : [];
  const appointments = appointmentsRaw
    .map(mapAppointment)
    .filter((a): a is NonNullable<typeof a> => a !== null);

  return {
    id,
    firstName,
    lastName,
    dateOfBirth:
      typeof data.dateOfBirth === 'string' ? data.dateOfBirth : '1970-01-01',
    gender,
    bloodGroup: bloodGroup as Patient['bloodGroup'],
    email: typeof data.email === 'string' ? data.email : '',
    phone: typeof data.phone === 'string' ? data.phone : '',
    address: typeof data.address === 'string' ? data.address : '',
    status: status as Patient['status'],
    department: typeof data.department === 'string' ? data.department : '',
    assignedDoctor:
      typeof data.assignedDoctor === 'string' ? data.assignedDoctor : '',
    admittedAt: toIsoString(data.admittedAt),
    ...(typeof data.lastVisitedAt === 'string'
      ? { lastVisitedAt: data.lastVisitedAt }
      : {}),
    ...(typeof data.dischargedAt === 'string'
      ? { dischargedAt: data.dischargedAt }
      : {}),
    vitals: mapVitals(data.vitals),
    diagnoses,
    appointments,
    ...(typeof data.avatarUrl === 'string'
      ? { avatarUrl: data.avatarUrl }
      : {}),
  };
}

function mergeSnapshotIntoMap(snap: QuerySnapshot, map: Map<string, Patient>): void {
  snap.forEach((docSnap) => {
    const data = docSnap.data() as Record<string, unknown>;
    if (typeof data.firstNameLower !== 'string' && typeof data.firstName === 'string') {
      void updateDoc(doc(db, PATIENTS_COLLECTION, docSnap.id), {
        firstNameLower: data.firstName.toLowerCase(),
        lastNameLower:
          typeof data.lastName === 'string' ? data.lastName.toLowerCase() : '',
      });
    }
    const patient = mapDocumentToPatient(docSnap.id, data);
    if (patient) {
      map.set(patient.id, patient);
    }
  });
}

/** Loads all patient documents (used by dashboard metrics). */
export async function fetchPatientsFromFirestore(): Promise<Patient[]> {
  const snap = await getDocs(collection(db, PATIENTS_COLLECTION));
  const out: Patient[] = [];
  snap.forEach((docSnap) => {
    const data = docSnap.data() as Record<string, unknown>;
    if (typeof data.firstNameLower !== 'string' && typeof data.firstName === 'string') {
      void updateDoc(doc(db, PATIENTS_COLLECTION, docSnap.id), {
        firstNameLower: data.firstName.toLowerCase(),
        lastNameLower:
          typeof data.lastName === 'string' ? data.lastName.toLowerCase() : '',
      });
    }
    const patient = mapDocumentToPatient(docSnap.id, data);
    if (patient) {
      out.push(patient);
    }
  });
  return out;
}

/**
 * Queries patients in Firestore: filters use `where`; text search uses indexed
 * `firstNameLower` / `lastNameLower` prefix ranges (merged). Status/department
 * are applied in Firestore when possible; otherwise merged candidates are
 * filtered to match (after prefix queries that may not include composite indexes).
 */
export async function queryPatientsFromFirestore(
  params: PatientsQueryParams
): Promise<Patient[]> {
  const q = params.search.trim().toLowerCase();
  const status =
    params.statusFilter === 'All' ? null : params.statusFilter;
  const department =
    params.departmentFilter === 'All' ? null : params.departmentFilter;

  const col = collection(db, PATIENTS_COLLECTION);
  const map = new Map<string, Patient>();

  if (!q) {
    if (!status && !department) {
      return fetchPatientsFromFirestore();
    }
    const constraints = [];
    if (status) {
      constraints.push(where('status', '==', status));
    }
    if (department) {
      constraints.push(where('department', '==', department));
    }
    const snap = await getDocs(query(col, ...constraints));
    mergeSnapshotIntoMap(snap, map);
    return Array.from(map.values());
  }

  const runPrefix = async (field: 'firstNameLower' | 'lastNameLower') => {
    const constraints = [
      where(field, '>=', q),
      where(field, '<=', `${q}\uf8ff`),
    ];
    try {
      const snap = await getDocs(query(col, ...constraints));
      mergeSnapshotIntoMap(snap, map);
    } catch {
      /* index may be missing; skip this branch */
    }
  };

  await runPrefix('firstNameLower');
  await runPrefix('lastNameLower');

  if (/^p-/.test(q)) {
    const idPrefix = q.toUpperCase();
    try {
      const snap = await getDocs(
        query(
          col,
          where('id', '>=', idPrefix),
          where('id', '<=', `${idPrefix}\uf8ff`)
        )
      );
      mergeSnapshotIntoMap(snap, map);
    } catch {
      /* optional id index */
    }
  }

  let out = Array.from(map.values());
  if (status) {
    out = out.filter((p) => p.status === status);
  }
  if (department) {
    out = out.filter((p) => p.department === department);
  }
  return out;
}

/** Distinct department and status values for filter UI (one full read). */
export async function fetchPatientFilterMetadata(): Promise<PatientFilterMetadata> {
  const snap = await getDocs(collection(db, PATIENTS_COLLECTION));
  const depts = new Set<string>();
  const statuses = new Set<string>();
  snap.forEach((d) => {
    const x = d.data() as Record<string, unknown>;
    if (typeof x.department === 'string' && x.department) {
      depts.add(x.department);
    }
    if (typeof x.status === 'string' && x.status) {
      statuses.add(x.status);
    }
  });
  return {
    departments: [...depts].sort(),
    statuses: [...statuses].sort(),
  };
}

/** Persists a patient document at `patients/{patient.id}`. */
export async function createPatientInFirestore(patient: Patient): Promise<void> {
  const ref = doc(db, PATIENTS_COLLECTION, patient.id);
  const payload = JSON.parse(JSON.stringify(patient)) as Record<string, unknown>;
  payload.firstNameLower = patient.firstName.toLowerCase();
  payload.lastNameLower = patient.lastName.toLowerCase();
  await setDoc(ref, payload);
}

/** Updates an existing patient document at `patients/{patient.id}`. */
export async function updatePatientInFirestore(patient: Patient): Promise<void> {
  const ref = doc(db, PATIENTS_COLLECTION, patient.id);
  const payload = JSON.parse(JSON.stringify(patient)) as Record<string, unknown>;
  payload.firstNameLower = patient.firstName.toLowerCase();
  payload.lastNameLower = patient.lastName.toLowerCase();
  await updateDoc(ref, payload);
}

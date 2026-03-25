import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import type { Patient, Vitals } from '@mednexus/shared/types';
import {
  addPatientSchema,
  bloodGroups,
  type AddPatientForm,
} from '@mednexus/shared/types';
import { usePatientStore } from '@mednexus/patients/data-access';
import { Button, Input, Label, cn } from '@mednexus/shared/ui';

function newPatientId(): string {
  return `P-${crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`;
}

function defaultVitals(): Vitals {
  const now = new Date().toISOString();
  return {
    bloodPressure: '118/76',
    heartRate: 72,
    temperature: 98.6,
    oxygenSaturation: 98,
    weight: 70,
    height: 170,
    recordedAt: now,
  };
}

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputDark =
  'bg-[#0f172a]/80 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-brand-500';

const selectDark =
  'w-full rounded-md border border-white/10 bg-[#0f172a]/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500';

export function AddPatientDialog() {
  const [open, setOpen] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const addPatient = usePatientStore((s) => s.addPatient);

  const form = useForm<AddPatientForm>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      bloodGroup: 'O+',
      email: '',
      phone: '',
      address: '',
      status: 'stable',
      department: '',
      assignedDoctor: '',
      admittedAt: toDatetimeLocalValue(new Date()),
      dischargedAt: '',
    },
  });

  const status = form.watch('status');

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    const admittedIso = new Date(values.admittedAt).toISOString();
    const patient: Patient = {
      id: newPatientId(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      bloodGroup: values.bloodGroup,
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      status: values.status,
      department: values.department.trim(),
      assignedDoctor: values.assignedDoctor.trim(),
      admittedAt: admittedIso,
      vitals: defaultVitals(),
      diagnoses: [],
      appointments: [],
      ...(values.status === 'discharged' && values.dischargedAt
        ? {
            dischargedAt: new Date(values.dischargedAt).toISOString(),
          }
        : {}),
    };
    try {
      await addPatient(patient);
      setOpen(false);
      form.reset({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: 'O+',
        email: '',
        phone: '',
        address: '',
        status: 'stable',
        department: '',
        assignedDoctor: '',
        admittedAt: toDatetimeLocalValue(new Date()),
        dischargedAt: '',
      });
    } catch (e) {
      setSubmitError((e as Error).message ?? 'Failed to save patient');
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
        >
          Add patient
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(100%-1.5rem,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-white/10 bg-[#1e293b] p-6 shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out'
          )}
        >
          <Dialog.Title className="text-lg font-semibold text-white mb-1">
            Add patient
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400 mb-4">
            Create a new clinical profile. It will be stored in Firestore.
          </Dialog.Description>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ap-first" className="text-gray-300">
                  First name
                </Label>
                <Input
                  id="ap-first"
                  className={inputDark}
                  {...form.register('firstName')}
                />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-rose-400">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap-last" className="text-gray-300">
                  Last name
                </Label>
                <Input
                  id="ap-last"
                  className={inputDark}
                  {...form.register('lastName')}
                />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-rose-400">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-dob" className="text-gray-300">
                Date of birth
              </Label>
              <Input
                id="ap-dob"
                type="date"
                className={inputDark}
                {...form.register('dateOfBirth')}
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-xs text-rose-400">
                  {form.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ap-gender" className="text-gray-300">
                  Gender
                </Label>
                <select
                  id="ap-gender"
                  className={selectDark}
                  {...form.register('gender')}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap-blood" className="text-gray-300">
                  Blood group
                </Label>
                <select
                  id="ap-blood"
                  className={selectDark}
                  {...form.register('bloodGroup')}
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="ap-email"
                type="email"
                className={inputDark}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-rose-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-phone" className="text-gray-300">
                Phone
              </Label>
              <Input
                id="ap-phone"
                className={inputDark}
                {...form.register('phone')}
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-rose-400">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-address" className="text-gray-300">
                Address
              </Label>
              <Input
                id="ap-address"
                className={inputDark}
                {...form.register('address')}
              />
              {form.formState.errors.address && (
                <p className="text-xs text-rose-400">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ap-status" className="text-gray-300">
                  Status
                </Label>
                <select
                  id="ap-status"
                  className={selectDark}
                  {...form.register('status')}
                >
                  <option value="active">Active</option>
                  <option value="stable">Stable</option>
                  <option value="critical">Critical</option>
                  <option value="observation">Observation</option>
                  <option value="discharged">Discharged</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap-dept" className="text-gray-300">
                  Department
                </Label>
                <Input
                  id="ap-dept"
                  className={inputDark}
                  {...form.register('department')}
                />
                {form.formState.errors.department && (
                  <p className="text-xs text-rose-400">
                    {form.formState.errors.department.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-doctor" className="text-gray-300">
                Assigned doctor
              </Label>
              <Input
                id="ap-doctor"
                className={inputDark}
                {...form.register('assignedDoctor')}
              />
              {form.formState.errors.assignedDoctor && (
                <p className="text-xs text-rose-400">
                  {form.formState.errors.assignedDoctor.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ap-admitted" className="text-gray-300">
                  Admitted at
                </Label>
                <Input
                  id="ap-admitted"
                  type="datetime-local"
                  className={inputDark}
                  {...form.register('admittedAt')}
                />
                {form.formState.errors.admittedAt && (
                  <p className="text-xs text-rose-400">
                    {form.formState.errors.admittedAt.message}
                  </p>
                )}
              </div>
              {status === 'discharged' && (
                <div className="space-y-1.5">
                  <Label htmlFor="ap-discharged" className="text-gray-300">
                    Discharged at
                  </Label>
                  <Controller
                    name="dischargedAt"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="ap-discharged"
                        type="datetime-local"
                        className={inputDark}
                        {...field}
                      />
                    )}
                  />
                  {form.formState.errors.dischargedAt && (
                    <p className="text-xs text-rose-400">
                      {form.formState.errors.dischargedAt.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-rose-400">{submitError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 bg-transparent text-gray-200 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {form.formState.isSubmitting ? 'Saving…' : 'Save patient'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

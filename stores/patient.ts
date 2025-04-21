import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patient', {
  state: () => ({
    selectedPatient: null as string | null,
    selectedInsurance: null,
    selectedService: null,
    selectedProvider: null,
    selectedVisitReason: null,
    selectedAppointmentDate: null,
    selectedAppointmentTime: null,
  }),
  getters: {
    patient: (state) => state.selectedPatient,
    insurance: (state) => state.selectedInsurance,
    service: (state) => state.selectedService,
    provider: (state) => state.selectedProvider,
    visitReason: (state) => state.selectedVisitReason,
    appointmentDate: (state) => state.selectedAppointmentDate,
    appointmentTime: (state) => state.selectedAppointmentTime,
  },
  actions: {
    setPatient(patient: any) {
      this.selectedPatient = patient
    },
    setInsurance(insurance: any) {
      this.selectedInsurance = insurance
    },
    setService(service: any) {
      this.selectedService = service
    },
    setProvider(provider: any) {
      this.selectedProvider = provider
    },
    setVisitReason(visitReason: any) {
      this.selectedVisitReason = visitReason
    },
    setAppointmentDate(date: any) {
      this.selectedAppointmentDate = date
    },
    setAppointmentTime(time: any) {
      this.selectedAppointmentTime = time
    },
    clearStore() {
      this.selectedPatient = null
      this.selectedInsurance = null
      this.selectedService = null
      this.selectedProvider = null
      this.selectedVisitReason = null
      this.selectedAppointmentDate = null
      this.selectedAppointmentTime = null
    },
  },
  persist: {
    enabled: true,
    storage: piniaPluginPersistedstate.localStorage(),
  },
})

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { MedicalCertificatesService } from "@/common/services/medical-certificates.service";
import type { 
  MedicalCertificate, 
  CreateMedicalCertificateRequest, 
  UpdateMedicalCertificateRequest,
  MedicalCertificatesQueryParams,
  CertificateStatus
} from "@/common/types/medical-certificate";

export const medicalCertificatesStore = defineStore("medicalCertificates", () => {
  const certificates = ref<MedicalCertificate[]>([]);
  const totalCertificates = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const searchNumber = ref('');
  const searchIcd = ref('');
  const searchUserName = ref('');
  const filterStatus = ref<CertificateStatus | ''>('');
  const filterUserBelongsTo = ref('');
  const filterUserCreatedBy = ref('');

  const totalPages = computed(() => Math.ceil(totalCertificates.value / pageSize.value));
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);
  const activeCertificates = computed(() => 
    certificates.value.filter(cert => cert.status === 'active' && !isCertificateExpired(cert))
  );
  
  const expiredCertificates = computed(() => 
    certificates.value.filter(cert => isCertificateExpired(cert))
  );
  
  const expiringSoonCertificates = computed(() => 
    certificates.value.filter(cert => {
      const daysRemaining = getDaysRemaining(cert.endsAt);
      return daysRemaining > 0 && daysRemaining <= 7 && cert.status === 'active';
    })
  );

  function getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function isCertificateExpired(certificate: MedicalCertificate): boolean {
    return getDaysRemaining(certificate.endsAt) < 0;
  }

  function getCertificateStatusColor(certificate: MedicalCertificate): string {
    if (certificate.status === 'inactive') return 'bg-gray-100 text-gray-800';
    
    const daysRemaining = getDaysRemaining(certificate.endsAt);
    if (daysRemaining < 0) return 'bg-gray-100 text-gray-800';
    if (daysRemaining <= 7) return 'bg-yellow-100 text-yellow-800';
    
    return 'bg-green-100 text-green-800';
  }

  function getCertificateStatusText(certificate: MedicalCertificate): string {
    if (certificate.status === 'inactive') return 'Inativo';
    
    const daysRemaining = getDaysRemaining(certificate.endsAt);
    if (daysRemaining < 0) return 'Expirado';
    if (daysRemaining <= 7) return `Expira em ${daysRemaining} dia(s)`;
    
    return 'Ativo';
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  async function loadCertificates(params?: MedicalCertificatesQueryParams) {
    try {
      isLoading.value = true;
      error.value = null;
      
      const queryParams: MedicalCertificatesQueryParams = params || {
        page: currentPage.value,
        page_size: pageSize.value,
        number: searchNumber.value || undefined,
        icd: searchIcd.value || undefined,
        status: filterStatus.value || undefined,
        userBelongsTo: filterUserBelongsTo.value || undefined,
        userCreatedBy: filterUserCreatedBy.value || undefined,
        userBelongsToName: searchUserName.value || undefined,
        userCreatedByName: searchUserName.value || undefined,
      };
      
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key as keyof MedicalCertificatesQueryParams] === '') {
          delete queryParams[key as keyof MedicalCertificatesQueryParams];
        }
      });
      
      const response = await MedicalCertificatesService.getCertificates(queryParams);
      certificates.value = response.data;
      totalCertificates.value = response.count;
      
      return response;
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar atestados médicos';
      console.error('Erro ao carregar atestados:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getCertificate(id: string) {
    try {
      const certificate = await MedicalCertificatesService.getCertificate(id);
      
      const index = certificates.value.findIndex(c => c.id === id);
      if (index !== -1) {
        certificates.value[index] = certificate;
      }
      
      return certificate;
    } catch (err: any) {
      console.error('Erro ao carregar atestado:', err);
      throw err;
    }
  }

  async function createCertificate(data: CreateMedicalCertificateRequest) {
    try {
      const certificate = await MedicalCertificatesService.createCertificate(data);
      
      await loadCertificates();
      
      return certificate;
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar atestado médico';
      console.error('Erro ao criar atestado:', err);
      throw err;
    }
  }

  async function updateCertificate(id: string, data: UpdateMedicalCertificateRequest) {
    try {
      const updatedCertificate = await MedicalCertificatesService.updateCertificate(id, data);
      
      const index = certificates.value.findIndex(c => c.id === id);
      if (index !== -1) {
        certificates.value[index] = updatedCertificate;
      }
      
      return updatedCertificate;
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar atestado médico';
      console.error('Erro ao atualizar atestado:', err);
      throw err;
    }
  }

  async function deleteCertificate(id: string) {
    try {
      await MedicalCertificatesService.deleteCertificate(id);
      
      const index = certificates.value.findIndex(c => c.id === id);
      if (index !== -1) {
        certificates.value.splice(index, 1);
        totalCertificates.value--;
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao excluir atestado médico';
      console.error('Erro ao excluir atestado:', err);
      throw err;
    }
  }

  function setPage(page: number) {
    currentPage.value = page;
  }

  function setPageSize(size: number) {
    pageSize.value = size;
    currentPage.value = 1;
  }

  function setFilters(filters: {
    number?: string;
    icd?: string;
    userName?: string;
    status?: CertificateStatus | '';
    userBelongsTo?: string;
    userCreatedBy?: string;
  }) {
    if (filters.number !== undefined) searchNumber.value = filters.number;
    if (filters.icd !== undefined) searchIcd.value = filters.icd;
    if (filters.userName !== undefined) searchUserName.value = filters.userName;
    if (filters.status !== undefined) filterStatus.value = filters.status;
    if (filters.userBelongsTo !== undefined) filterUserBelongsTo.value = filters.userBelongsTo;
    if (filters.userCreatedBy !== undefined) filterUserCreatedBy.value = filters.userCreatedBy;
    currentPage.value = 1;
  }

  function clearFilters() {
    searchNumber.value = '';
    searchIcd.value = '';
    searchUserName.value = '';
    filterStatus.value = '';
    filterUserBelongsTo.value = '';
    filterUserCreatedBy.value = '';
    currentPage.value = 1;
  }

  function clearError() {
    error.value = null;
  }

  return {
    certificates,
    totalCertificates,
    currentPage,
    pageSize,
    isLoading,
    error,
    searchNumber,
    searchIcd,
    searchUserName,
    filterStatus,
    filterUserBelongsTo,
    filterUserCreatedBy,
    
    totalPages,
    hasNextPage,
    hasPrevPage,
    activeCertificates,
    expiredCertificates,
    expiringSoonCertificates,
    
    loadCertificates,
    getCertificate,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    setPage,
    setPageSize,
    setFilters,
    clearFilters,
    clearError,
    getDaysRemaining,
    isCertificateExpired,
    getCertificateStatusColor,
    getCertificateStatusText,
    formatDate,
    formatDateTime
  };
});

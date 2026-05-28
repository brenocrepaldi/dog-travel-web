import { documentStatus as seedStatus, walkerCertificates } from "@/lib/mock-data";
import type { DocumentsStatus, WalkerCertDocument, DocStatus } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable store
let statusStore: DocumentsStatus = { ...seedStatus, certificates: [...walkerCertificates] };

export const DocumentsApi = {
  getStatus: async (): Promise<DocumentsStatus> => {
    if (!isApiConfigured) {
      return { ...statusStore, certificates: [...statusStore.certificates] };
    }
    return api.get<DocumentsStatus>("/profile/documents").then((r) => r.data);
  },

  uploadIdentity: async (doc: File, selfie: File): Promise<void> => {
    if (!isApiConfigured) {
      await new Promise((r) => setTimeout(r, 600));
      statusStore = { ...statusStore, identity: "pending" };
      return;
    }
    const form = new FormData();
    form.append("document", doc);
    form.append("selfie", selfie);
    await api.post("/profile/documents/identity", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadBackground: async (doc: File): Promise<void> => {
    if (!isApiConfigured) {
      await new Promise((r) => setTimeout(r, 600));
      statusStore = { ...statusStore, background: "pending" };
      return;
    }
    const form = new FormData();
    form.append("document", doc);
    await api.post("/profile/documents/background", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  addCertificate: async (title: string, file: File): Promise<WalkerCertDocument> => {
    if (!isApiConfigured) {
      await new Promise((r) => setTimeout(r, 400));
      const entry: WalkerCertDocument = {
        id: crypto.randomUUID(),
        title,
        fileName: file.name,
        status: "pending" as DocStatus,
      };
      statusStore = {
        ...statusStore,
        certificates: [...statusStore.certificates, entry],
      };
      return entry;
    }
    const form = new FormData();
    form.append("title", title);
    form.append("file", file);
    return api
      .post<WalkerCertDocument>("/profile/documents/certificates", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  removeCertificate: async (id: string): Promise<void> => {
    if (!isApiConfigured) {
      statusStore = {
        ...statusStore,
        certificates: statusStore.certificates.filter((c) => c.id !== id),
      };
      return;
    }
    await api.delete(`/profile/documents/certificates/${id}`);
  },
};

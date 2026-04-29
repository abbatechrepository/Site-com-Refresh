"use client";

import { FormEvent } from "react";

import {
  emptyNewsletterCampaignForm,
  emptyNewsletterGroupForm,
  emptyNewsletterRecipientForm
} from "../_lib/constants";
import { apiRequest } from "../_lib/api";
import type { useRefreshManagerSession } from "./useRefreshManagerSession";
import type { useRefreshManagerState } from "./useRefreshManagerState";

type RefreshManagerState = ReturnType<typeof useRefreshManagerState>;
type RefreshManagerSession = ReturnType<typeof useRefreshManagerSession>;

export function useRefreshManagerNewsletterMutations(
  state: RefreshManagerState,
  session: RefreshManagerSession
) {
  async function handleNewsletterGroupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.newsletterGroupForm.id
        ? `/management/newsletter-groups/${state.newsletterGroupForm.id}`
        : "/management/newsletter-groups";
      const method = state.newsletterGroupForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.newsletterGroupForm.name,
            description: state.newsletterGroupForm.description || undefined
          })
        },
        state.token
      );

      state.setNewsletterGroupForm(emptyNewsletterGroupForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.newsletterGroupForm.id ? "Grupo atualizado com sucesso." : "Grupo criado com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar grupo.");
      return false;
    }
  }

  async function handleNewsletterRecipientSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.newsletterRecipientForm.id
        ? `/management/newsletter-recipients/${state.newsletterRecipientForm.id}`
        : "/management/newsletter-recipients";
      const method = state.newsletterRecipientForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            email: state.newsletterRecipientForm.email,
            name: state.newsletterRecipientForm.name || undefined,
            groupId: state.newsletterRecipientForm.groupId,
            consentAt: state.newsletterRecipientForm.consentAt,
            unsubscribedAt: state.newsletterRecipientForm.unsubscribedAt
          })
        },
        state.token
      );

      state.setNewsletterRecipientForm(emptyNewsletterRecipientForm);
      await session.bootstrap(state.token);
      state.setSuccess(
        state.newsletterRecipientForm.id ? "Destinatário atualizado com sucesso." : "Destinatário criado com sucesso."
      );
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar destinatário.");
      return false;
    }
  }

  async function handleNewsletterCampaignSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.newsletterCampaignForm.id
        ? `/management/newsletter-campaigns/${state.newsletterCampaignForm.id}`
        : "/management/newsletter-campaigns";
      const method = state.newsletterCampaignForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.newsletterCampaignForm.name,
            subject: state.newsletterCampaignForm.subject,
            senderName: state.newsletterCampaignForm.senderName,
            senderEmail: state.newsletterCampaignForm.senderEmail,
            bodyHtml: state.newsletterCampaignForm.bodyHtml,
            bodyText: state.newsletterCampaignForm.bodyText || undefined,
            status: state.newsletterCampaignForm.status,
            scheduledAt: state.newsletterCampaignForm.scheduledAt,
            sentAt: state.newsletterCampaignForm.sentAt,
            recipientGroupId: state.newsletterCampaignForm.recipientGroupId || undefined
          })
        },
        state.token
      );

      state.setNewsletterCampaignForm(emptyNewsletterCampaignForm);
      await session.bootstrap(state.token);
      state.setSuccess(
        state.newsletterCampaignForm.id ? "Campanha atualizada com sucesso." : "Campanha criada com sucesso."
      );
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar campanha.");
      return false;
    }
  }

  return {
    handleNewsletterGroupSubmit,
    handleNewsletterRecipientSubmit,
    handleNewsletterCampaignSubmit
  };
}

// SPDX-FileCopyrightText: © 2017 EteSync Authors
// SPDX-License-Identifier: AGPL-3.0-only

import * as EteSync from 'etesync';

import { CredentialsData, UserInfoData } from './store';
import { addEntries } from './store/actions';

export function createJournalEntry(
  etesync: CredentialsData,
  userInfo: UserInfoData,
  journal: EteSync.Journal,
  prevUid: string | null,
  action: EteSync.SyncEntryAction,
  content: string) {

  const syncEntry = new EteSync.SyncEntry();
  syncEntry.action = action;
  syncEntry.content = content;

  return createJournalEntryFromSyncEntry(etesync, userInfo, journal, prevUid, syncEntry);
}

export function createJournalEntryFromSyncEntry(
  etesync: CredentialsData,
  userInfo: UserInfoData,
  journal: EteSync.Journal,
  prevUid: string | null,
  syncEntry: EteSync.SyncEntry) {

  const derived = etesync.encryptionKey;

  const keyPair = userInfo.getKeyPair(userInfo.getCryptoManager(derived));
  const cryptoManager = journal.getCryptoManager(derived, keyPair);
  const entry = new EteSync.Entry();
  entry.setSyncEntry(cryptoManager, syncEntry, prevUid);

  return entry;
}

export function addJournalEntry(
  etesync: CredentialsData,
  userInfo: UserInfoData,
  journal: EteSync.Journal,
  prevUid: string | null,
  action: EteSync.SyncEntryAction,
  content: string) {

  const entry = createJournalEntry(etesync, userInfo, journal, prevUid, action, content);
  return addEntries(etesync, journal.uid, [entry], prevUid);
}

/**
 * Adds multiple journal entries and uploads them all at once
 * @param updates list of tuples with shape (action, content)
 */
export function addJournalEntries(
  etesync: CredentialsData,
  userInfo: UserInfoData,
  journal: EteSync.Journal,
  lastUid: string | null,
  updates: [EteSync.SyncEntryAction, string][]) {

  let prevUid = lastUid;

  const entries = updates.map(([action, content]) => {
    const entry = createJournalEntry(etesync, userInfo, journal, prevUid, action, content);
    prevUid = entry.uid;
    return entry;
  });

  return addEntries(etesync, journal.uid, entries, lastUid);
}

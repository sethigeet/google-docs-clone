import { Document } from "../models";

const DEFAULT_DATA = "";

export const findOrCreateDocument = async (documentId: string) => {
  // if (documentId === null) return;

  const document = await Document.findById(documentId);

  if (document) return document;

  return await Document.create({ _id: documentId, data: DEFAULT_DATA });
};

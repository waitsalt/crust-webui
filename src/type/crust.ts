type Pin = {
  cid: string;
  name: string;
  origins: string[];
  meta: object;
};

type PinStatus = {
  requestId: string;
  status: "queued" | "pinning" | "pinned" | "fail";
  created: string;
  delegates: string[];
  info: object;
  pin: Pin;
};

type PinListResponse = {
  count: number;
  results: PinStatus[];
};

type UploadFileResponse = {
  Name: string;
  Hash: string;
  Size: string;
};

export type {
  Pin,
  PinStatus,
  PinListResponse,
  UploadFileResponse,
};

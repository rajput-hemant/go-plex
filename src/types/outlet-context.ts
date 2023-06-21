export type Alert = {
  title: string;
  description: string;
  variant: "default" | "destructive";
};

export type OutletContext = {
  jwtToken: string | null;
  setAlert: (alert: Alert | null) => void;
  setJwtToken: (jwtToken: string | null) => void;
};

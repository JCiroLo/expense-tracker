import React from "react";
import { Dialog } from "@/types/global";

type DialogContextType = {
  queue: Record<Dialog, true | undefined>;
  open: (id: Dialog) => void;
  isOpen: (id: Dialog) => boolean;
  close: (id: Dialog) => void;
  clear: () => void;
};

type DialogProviderProps = {
  children: React.ReactNode;
};

const DialogContext = React.createContext<DialogContextType>(null!);

const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [queue, setQueue] = React.useState({} as Record<Dialog, true | undefined>);

  const open = (id: Dialog) => setQueue((prev) => ({ ...prev, [id]: true }));

  const isOpen = (id: Dialog) => Boolean(queue[id]);

  const close = (id: Dialog) =>
    setQueue((prev) => {
      const newQueue = { ...prev };
      delete newQueue[id];
      return newQueue;
    });

  const clear = () => setQueue({} as Record<Dialog, true | undefined>);

  return <DialogContext.Provider value={{ queue, open, isOpen, close, clear }}>{children}</DialogContext.Provider>;
};

export { DialogContext };
export default DialogProvider;

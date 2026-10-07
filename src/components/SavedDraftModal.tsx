import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HiOutlineCheckCircle } from "react-icons/hi2";

type SavedDraftModalProps = {
  isOpen: boolean;
};

export const SavedDraftModal = ({ isOpen }: SavedDraftModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => undefined}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-95"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-surface-elevated border border-border p-8 shadow-2xl transition-all text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-muted">
                  <HiOutlineCheckCircle className="text-3xl text-accent" />
                </div>
                <Dialog.Title as="h3" className="text-xl font-semibold text-text-primary mb-2">
                  Draft saved
                </Dialog.Title>
                <p className="text-sm text-text-muted">
                  Navigating back to your dashboard...
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

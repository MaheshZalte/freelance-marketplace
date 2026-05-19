function Modal({

  isOpen,

  onClose,

  title,

  children,
}) {

  if (!isOpen) {

    return null;
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <h2 className="text-xl font-black text-slate-950">

            {title}

          </h2>

          <button
            onClick={onClose}
            className="rounded-md px-3 py-1 text-slate-500 transition hover:bg-slate-100"
          >

            ✕

          </button>

        </div>

        {/* BODY */}
        <div className="p-5">

          {children}

        </div>

      </div>

    </div>
  );
}

export default Modal;
import Dashboard from "./Dashboard";
import AskInput from "./AskInput";
import { useChat } from "../context/ChatContext";

// ----------------------------
// AskInput Wrapper
// ----------------------------
function AskInputWrapper({ patientId, externalFile, clearExternalFile }) {
  const { sendMessage } = useChat();

  return (
    <AskInput
      onSend={(payload) => sendMessage(patientId, payload)}
      externalFile={externalFile}
      onExternalFileHandled={clearExternalFile}
    />
  );
}

export default function({showModal, setShowModal, onNewPatientAdded, patientId, children, externalFile, clearExternalFile}) {
    return(
        <div className="relative h-screen">
            <div className="w-full max-w-3xl">
                {!patientId ? (
                    <Dashboard showModal={showModal} setShowModal={setShowModal} onNewPatientAdded={onNewPatientAdded}/>
                ) : (
                    <div aria-live="polite" className="w-full h-full">
                        {children}
                    </div>
                )}
            </div>
            {patientId && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="w-full max-w-3xl">
                        <AskInputWrapper
                        patientId={patientId}
                        externalFile={externalFile}
                        clearExternalFile={clearExternalFile}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
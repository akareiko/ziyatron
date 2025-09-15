import PatientGrid from "./PatientGrid";
import NewPatientModal from "./NewPatientModal";

export default function Dashboard({showModal, setShowModal, onNewPatientAdded}) {
    return (
        <>
            <NewPatientModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onNewPatientAdded={onNewPatientAdded}
            />

            <div className="flex flex-col items-start w-full max-w-6xl mx-auto px-6 mt-16 space-y-8">
                {/* Header */}
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <span className="flex flex-row gap-2 items-center">
                        {/* <svg width="24px" height="24px" viewBox="0 0 679 592" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M564.765 440C488.279 440 435.84 364.92 462.123 293.091L569.006 1V1C644.789 1 697.498 76.3487 671.514 147.538L564.765 440Z" fill="black"/>
                            <path d="M97.6049 591C30.0284 591 -16.7693 523.535 6.90204 460.24L119 160.5C186.573 160.598 231.66 229.611 208.5 293.091L97.6049 591V591Z" fill="black"/>
                            <path d="M162.18 524.022C150.415 556.612 174.56 591 209.209 591H506L517.8 561C427.804 561 367.108 471.175 397.052 386.306L509.489 67.6364C520.966 35.1062 496.833 1 462.337 1H176.8L165 31C256.831 31 305.912 123.674 275.439 210.301L162.18 524.022Z" fill="black"/>
                            <path d="M564.765 440C488.279 440 435.84 364.92 462.123 293.091L569.006 1V1C644.789 1 697.498 76.3487 671.514 147.538L564.765 440Z" stroke="black"/>
                            <path d="M97.6049 591C30.0284 591 -16.7693 523.535 6.90204 460.24L119 160.5C186.573 160.598 231.66 229.611 208.5 293.091L97.6049 591V591Z" stroke="black"/>
                            <path d="M162.18 524.022C150.415 556.612 174.56 591 209.209 591H506L517.8 561C427.804 561 367.108 471.175 397.052 386.306L509.489 67.6364C520.966 35.1062 496.833 1 462.337 1H176.8L165 31C256.831 31 305.912 123.674 275.439 210.301L162.18 524.022Z" stroke="black"/>
                        </svg> */}

                        <h3 className="text-2xl sm:text-3xl font-semibold">
                            Welcome to Ziyatron
                        </h3>
                    </span>
                    <div className="flex items-center gap-2">
                        <p className="text-lg text-gray-600">Create a new patient</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="p-3 rounded-full bg-black/10 hover:bg-black/20 transition duration-200 flex items-center justify-center"
                            aria-label="Create new patient"
                        >
                            <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Subheader / intro */}
                <p className="text-gray-700 text-base sm:text-lg max-w-2xl">
                    Manage your patients here. Browse existing records or create a new one. 
                </p>

                {/* Patients Section */}
                <div className="w-full">
                    <p className="text-lg sm:text-xl font-medium mb-4 text-gray-800">
                        Browse Patients
                    </p>
                    <PatientGrid/>
                </div>

                {/* Optional footer info */}
                <p className="text-gray-500 text-sm mt-6">
                    Tip: Hover over a patient card to see more details or quickly access their chat. Use the "Create a new patient" button to add new records.
                </p>
            </div>
        </>
    );
}
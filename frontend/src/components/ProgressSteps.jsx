const ProgressSteps = ({ step1, step2, step3 }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <div className={`${step1 ? "text-green-500" : "text-gray-300"} flex flex-col items-center sm:items-start`}>
                <span className="text-sm sm:text-base">Login</span>
                <div className="mt-1 text-lg">✅</div>
            </div>

            {step2 && (
                <>
                    {step1 && <div className="h-0.5 w-full sm:w-[6rem] md:w-[8rem] lg:w-[10rem] bg-green-500"></div>}
                    <div className={`${step1 ? "text-green-500" : "text-gray-300"} flex flex-col items-center sm:items-start`}>
                        <span className="text-sm sm:text-base">Shipping</span>
                        <div className="mt-1 text-lg">✅</div>
                    </div>
                </>
            )}

            {step1 && step2 && (
                <div className="h-0.5 w-full sm:w-[6rem] md:w-[8rem] lg:w-[10rem] bg-green-500"></div>
            )}

            <div className={`flex flex-col items-center sm:items-start ${step3 ? "text-green-500" : "text-gray-300"}`}>
                <span className="text-sm sm:text-base">Summary</span>
                {step3 && <div className="mt-1 text-lg">✅</div>}
            </div>
        </div>
    );
};

export default ProgressSteps;

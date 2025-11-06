import { header } from "../components/header";

export const NotFoundPage = {
    template() {
        return `
        <div class="bg-gray-800 fixed inset-0 z-[9999] flex flex-1 items-center justify-center overflow-hidden rounded-lg">
                <div class="flex flex-col items-center justify-center px-6 text-center">
                    <!-- Icon -->
                    <div class="text-8xl mb-8 opacity-50">🔍</div>

                    <!-- 404 Error Code -->
                    <h1 class="text-9xl font-extrabold text-blue-300 mb-6">
                        404
                    </h1>

                    <!-- Title -->
                    <h2 class="text-4xl font-bold text-gray-100 mb-4">
                        Page Not Found
                    </h2>

                    <!-- Description -->
                    <p class="text-lg text-gray-400 mb-10 max-w-md">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>

                    <a href="/" data-link class="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1">
                        Go Home
                    </a>

                </div>
            </div>
        `;
    },

    init () {
        console.log('404 page loaded!');
    }
} as const;


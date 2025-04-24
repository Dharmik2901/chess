import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"

export const Landing = () => {  
    const navigate = useNavigate()
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto bg-slate-800 bg-opacity-30 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative flex items-center justify-center p-6 md:p-12">
                <div className="absolute inset-0 bg-black opacity-20 md:opacity-0 z-0"></div>
                <img 
                  src="/chessboard.png"
                  alt="Chess board" 
                  className="max-w-lg w-full object-contain relative z-10 rounded-lg shadow-2xl transform transition-transform hover:scale-105"
                />
              </div>
              
              <div className="flex flex-col justify-center p-8 md:p-12 space-y-6 relative z-10">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Welcome to Chess
                </h1>
                
                <div className="space-y-4">
                  <p className="text-xl text-gray-200">
                    Play chess with your Anonymous friends in real-time.
                  </p>
                  <p className="text-lg text-gray-300">
                    Challenge opponents from around the world and improve your skills. 
                    No registration required!
                  </p>
                </div>
                
                <div className="pt-6">
                  <Button 
                    onClick={() => navigate("/game")} 
                    size="lg"
                  >
                    Start Playing Now
                  </Button>
                </div>
                
                <div className="mt-8 flex gap-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Free to play
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No registration
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Real-time play
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
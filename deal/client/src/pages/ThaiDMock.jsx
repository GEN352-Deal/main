import { useNavigate } from 'react-router-dom'

export default function ThaiDMock() {
  const navigate = useNavigate()

  const handleVerify = () => {
    const mockUser = {
      id: '1103700000001',
      name: 'Jantararat Sawatkamonworachot',
      email: 'demo@deal.com',
      verified: true,
      provider: 'ThaiD'
    }

    localStorage.setItem('deal_user', JSON.stringify(mockUser))
    localStorage.setItem('deal_token', 'mock-thaid-token')

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-8 border border-zinc-800 shadow-2xl text-white">
        <div className="text-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/ThaiD_Logo.png/600px-ThaiD_Logo.png"
            alt="ThaiD"
            className="w-24 mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold">ThaiD Authentication</h1>
          <p className="text-zinc-400 mt-2">
            Mock identity verification system
          </p>
        </div>

        <div className="bg-zinc-800 rounded-2xl p-5 mb-6">
          <p className="text-sm text-zinc-400">Citizen ID</p>
          <p className="text-lg font-semibold">1103700000001</p>

          <div className="h-px bg-zinc-700 my-4"></div>

          <p className="text-sm text-zinc-400">Full Name</p>
          <p className="text-lg font-semibold">
            Jantararat Sawatkamonworachot
          </p>
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-pink-500 hover:bg-pink-600 transition rounded-2xl py-4 text-lg font-semibold"
        >
          Verify Identity
        </button>
      </div>
    </div>
  )
}
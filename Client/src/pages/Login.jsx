import {useState} from 'react'
import {axiosInstance} from '../axiosCalls/axios';
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../context/authContext';


export default function Login() {
    const [formData, setFormData] = useState({"email":"", "password":""});
    const navigate = useNavigate();
    const {setCustomer} = useAuth();
    function handleChange(e){

        // Keep formData in sync with the email/password inputs.
        setFormData((prev)=>{
            return ({...prev, [e.target.name]:e.target.value})
        })
    }

    async function handleSubmit(e){
        e.preventDefault();

        try{
            // Successful login sets the global customer and stores the cookie via the backend.
            const response = await axiosInstance.post('/customer/login', formData)
            setCustomer(response.data.customerData);
            navigate('/home');
      } catch (error) {
        console.log(error.response?.data || error.message)
        }


    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f1e7] px-4 py-12">
      <div className="w-full max-w-md border border-[#c9bda6] bg-[#fbf8f1] p-10 shadow-[0_20px_60px_-20px_rgba(43,33,24,0.25)]">
        <div className="border border-[#e2d9c6] p-8">
          {/* Brand mark */}
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">
            Ashford &amp; Sons
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#c9bda6]" />
            <span className="text-[10px] text-[#b08d57]">❦</span>
            <span className="h-px w-8 bg-[#c9bda6]" />
          </div>

          <h1 className="mt-6 text-center font-serif text-3xl text-[#2b2118]">
            Welcome Back
          </h1>
          <p className="mt-2 text-center font-serif text-sm italic text-[#8a7c66]">
            Sign in to your account.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[#6e6250]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jonathan@ashford.com"
                onChange={handleChange}
                className="w-full border border-[#d9cfbe] bg-[#f6f1e7] px-3.5 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition placeholder:text-[#b3a68e] focus:border-[#7a4a2b]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[#6e6250]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full border border-[#d9cfbe] bg-[#f6f1e7] px-3.5 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition placeholder:text-[#b3a68e] focus:border-[#7a4a2b]"
                onChange={handleChange}
              />
            </div>


            <button
              type="submit"
              className="w-full bg-[#2b2118] py-3 text-xs uppercase tracking-[0.25em] text-[#f6f1e7] transition hover:bg-[#7a4a2b]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center font-serif text-sm text-[#6e6250]">
            New to Ashford?{' '}
            <a href="/register" className="text-[#7a4a2b] underline decoration-[#c9bda6] underline-offset-4 transition hover:decoration-[#7a4a2b]">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

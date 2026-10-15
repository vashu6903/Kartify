import {useState} from 'react';
import {axiosInstance} from '../axiosCalls/axios.js';
import {useNavigate} from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({"fullName":"", "email":"", "password":"", "phone":""});
  const navigate = useNavigate();

    function handleChange(e){
        e.preventDefault();

        // Input names match backend fields, so one handler can update the whole form.
        setFormData((prev)=>{
            return ({...prev, [e.target.name] : e.target.value})
        })
    }

    async function handleSubmit(e){
        e.preventDefault();

        try{
          // Registration creates the account, then the user logs in separately.
          const response = await axiosInstance.post("/customer/register", formData);
          if (response){
            navigate('/login');
          }


        } catch (error){
            // if(error.response){
            //     toast.error(error.response.message)
            // }
            console.log(error.response)
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f1e7] px-4 py-12">
      <div className="w-full max-w-md border border-[#c9bda6] bg-[#fbf8f1] p-10 shadow-[0_20px_60px_-20px_rgba(43,33,24,0.25)]">
        <div className="border border-[#e2d9c6] p-8">
          {/* Brand mark */}
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">
            LederStudioCo
          </p>
          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#c9bda6]" />
            <span className="text-[10px] text-[#b08d57]">❦</span>
            <span className="h-px w-8 bg-[#c9bda6]" />
          </div>

          <h1 className="mt-6 text-center font-serif text-3xl text-[#2b2118]">
            Create an Account
          </h1>
          <p className="mt-2 text-center font-serif text-sm italic text-[#8a7c66]">
            Join the house of fine leather.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[#6e6250]">
                Full Name
              </label>
              <input
                id="name"
                name="fullName"
                type="text"
                placeholder="Jonathan Ashford"
                className="w-full border border-[#d9cfbe] bg-[#f6f1e7] px-3.5 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition placeholder:text-[#b3a68e] focus:border-[#7a4a2b]"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="username" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[#6e6250]">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="j.ashford"
                className="w-full border border-[#d9cfbe] bg-[#f6f1e7] px-3.5 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition placeholder:text-[#b3a68e] focus:border-[#7a4a2b]"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[#6e6250]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jonathan@ashford.com"
                className="w-full border border-[#d9cfbe] bg-[#f6f1e7] px-3.5 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition placeholder:text-[#b3a68e] focus:border-[#7a4a2b]"
                onChange={handleChange}
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

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[#6e6250]">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 555 0100"
                className="w-full border border-[#d9cfbeUnauthenticated] bg-[#f6f1e7] px-3.5 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition placeholder:text-[#b3a68e] focus:border-[#7a4a2b]"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2b2118] py-3 text-xs uppercase tracking-[0.25em] text-[#f6f1e7] transition hover:bg-[#7a4a2b]"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center font-serif text-sm text-[#6e6250]">
            Already a member?{' '}
            <a href="/login" className="text-[#7a4a2b] underline decoration-[#c9bda6] underline-offset-4 transition hover:decoration-[#7a4a2b]">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

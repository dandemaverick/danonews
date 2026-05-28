export default function Widgets() {
  return (
    <div className="space-y-8">
      {/* Trending */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
          🔥 Trending Now
        </h3>
        <div className="space-y-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="flex gap-4 cursor-pointer hover:bg-gray-50 -mx-2 p-2 rounded-xl">
              <div className="text-3xl font-bold text-gray-200">{i}</div>
              <div className="text-sm leading-tight">
                Fuel prices expected to drop significantly next month
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-900 text-white p-8 rounded-2xl">
        <h3 className="text-2xl font-bold mb-3">Newsletter</h3>
        <p className="text-gray-400 mb-6">Get the day's top stories delivered to your inbox.</p>
        
        <input 
          type="email" 
          placeholder="Your email address" 
          className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl mb-4 focus:outline-none"
        />
        <button className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-semibold text-lg">
          Subscribe Now
        </button>
      </div>

      {/* Advertise */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl text-center">
        <h4 className="font-bold text-xl mb-3">Advertise With Us</h4>
        <p className="text-blue-100 mb-6">Reach thousands of engaged readers daily across Ghana</p>
        <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold">
          Learn More
        </button>
      </div>
    </div>
  );
}
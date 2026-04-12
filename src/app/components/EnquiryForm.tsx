export function EnquiryForm() {
  return (
    <div className="bg-gray-50 border border-gray-200 p-12">
      <h2 className="text-3xl mb-3 tracking-tight">Need Higher Quantity or Trade Pricing?</h2>
      <p className="text-sm text-gray-600 mb-10">
        Complete the form below and our trade team will get back to you within 24 hours.
      </p>

      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm mb-2 text-gray-900">
              Name *
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm mb-2 text-gray-900">
              Company *
            </label>
            <input
              type="text"
              id="company"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm mb-2 text-gray-900">
              Email *
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="product" className="block text-sm mb-2 text-gray-900">
              Product
            </label>
            <input
              type="text"
              id="product"
              className="w-full px-4 py-3 border border-gray-300 bg-gray-100 focus:outline-none focus:border-gray-900 transition-colors"
              readOnly
            />
          </div>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm mb-2 text-gray-900">
            Quantity Required
          </label>
          <input
            type="text"
            id="quantity"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm mb-2 text-gray-900">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-10 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide"
        >
          SEND ENQUIRY
        </button>
      </form>
    </div>
  );
}

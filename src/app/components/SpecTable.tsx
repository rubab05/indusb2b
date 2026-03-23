interface SpecRow {
  variant: string;
  diameter: string;
  capacity: string;
  material: string;
  hobCompatibility: string;
  lidIncluded: string;
  finish: string;
}

interface SpecTableProps {
  specs: SpecRow[];
}

export function SpecTable({ specs }: SpecTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-xs tracking-widest text-gray-900 border-b border-gray-200">VARIANT</th>
            <th className="px-6 py-4 text-xs tracking-widest text-gray-900 border-b border-gray-200">DIAMETER</th>
            <th className="px-6 py-4 text-xs tracking-widest text-gray-900 border-b border-gray-200">CAPACITY</th>
            <th className="px-6 py-4 text-xs tracking-widest text-gray-900 border-b border-gray-200">MATERIAL</th>
            <th className="px-6 py-4 text-xs tracking-widest text-gray-900 border-b border-gray-200">HOB COMPATIBILITY</th>
            <th className="px-6 py-4 text-xs tracking-widest text-gray-900 border-b border-gray-200">LID INCLUDED</th>
            <th className="px-6 py-4 text-xs tracking-widest text-gray-900 border-b border-gray-200">FINISH</th>
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-100">{spec.variant}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{spec.diameter}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{spec.capacity}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{spec.material}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{spec.hobCompatibility}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{spec.lidIncluded}</td>
              <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{spec.finish}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SectionHeader({ title }) {
  return (
    <h2 className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-gradient p-8">
      <span className="inline-block transform scale-x-[-1] text-gradient mr-4">
        𓅓
      </span>
      {title}
      <span className="inline-block ml-4 text-gradient">𓅓</span>
    </h2>
    
  );
}

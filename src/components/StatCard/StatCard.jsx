function StatCard({ title, number }) {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <h2>{number}</h2>
    </div>
  );
}

export default StatCard;
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '../ui/Primitives'
import { formatCurrency } from '../../lib/utils'

export function MetricCard({ label, value, change, tone = 'aqua', hint }) {
  const positive = change >= 0
  return <Card className={`metric-card metric-${tone}`}>
    <div className="metric-top"><span>{label}</span><span className={`metric-spark ${positive ? 'up' : 'down'}`}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(change)}%</span></div>
    <strong>{formatCurrency(value)}</strong>
    <p>{hint || 'compared with last month'}</p>
    <div className="metric-wave" />
  </Card>
}

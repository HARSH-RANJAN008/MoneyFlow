import * as Icons from 'lucide-react'
import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from 'lucide-react'
import { Badge, IconButton } from '../ui/Primitives'
import { formatCurrency, formatDate } from '../../lib/utils'

const iconMap = { briefcase: Icons.BriefcaseBusiness, 'shopping-basket': Icons.ShoppingBasket, zap: Icons.Zap, plane: Icons.Plane, sparkles: Icons.Sparkles, 'line-chart': Icons.ChartNoAxesCombined, music: Icons.Music2, car: Icons.CarFront }
const statusTone = { Completed: 'success', Pending: 'warning', Failed: 'danger' }

export function TransactionTable({ items, compact = false, onSelect }) {
  return <div className="table-wrap"><table className="transaction-table"><thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th className="align-right">Amount</th><th>Status</th>{!compact && <th aria-label="Actions" />}</tr></thead><tbody>
    {items.map((item) => {
      const ItemIcon = iconMap[item.icon] || Icons.ReceiptText
      return <tr key={item.id} onClick={() => onSelect?.(item)} className={onSelect ? 'row-clickable' : ''}>
        <td><div className="transaction-name"><span className={`transaction-icon ${item.type}`}><ItemIcon size={17} /></span><span><strong>{item.title}</strong><small>{item.merchant}</small></span></div></td>
        <td><span className="category-label">{item.category}</span></td><td className="date-label">{formatDate(item.date)}</td>
        <td className={`amount align-right ${item.amount >= 0 ? 'income' : ''}`}>{item.amount >= 0 ? '+' : '−'}{formatCurrency(Math.abs(item.amount))}</td>
        <td><Badge tone={statusTone[item.status]}>{item.status}</Badge></td>
        {!compact && <td><IconButton label={`Actions for ${item.title}`} onClick={(event) => { event.stopPropagation(); onSelect?.(item) }}><MoreHorizontal size={18} /></IconButton></td>}
      </tr>
    })}</tbody></table></div>
}

export function TransactionDirection({ amount }) { return amount >= 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} /> }

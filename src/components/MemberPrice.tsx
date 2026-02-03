export function MemberPrice({ member, retail }: { member: string; retail: string }) {
  return (
    <div className="mt-3 space-y-1">
      <div className="text-sm text-neutral-800">
        <span className="text-neutral-500">Member</span> {member}
      </div>
      <div className="text-xs text-neutral-500">
        <span className="text-neutral-500">Retail</span> {retail}
      </div>
    </div>
  )
}

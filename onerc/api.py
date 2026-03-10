import frappe
from frappe.utils import cint


@frappe.whitelist(allow_guest=True)
def get_open_opportunities(limit=50):
	"""Return open opportunities for the public opportunities page."""
	limit = cint(limit) or 50
	limit = min(limit, 200)

	opportunities = frappe.get_all(
		"Opportunity",
		filters={"status": "Open"},
		fields=["name", "degisination", "profession", "location", "status", "posted_on", "closed_on"],
		order_by="posted_on desc",
		limit_page_length=limit,
	)

	return {
		"count": len(opportunities),
		"opportunities": opportunities,
	}

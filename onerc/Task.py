import frappe
from frappe.utils import nowdate


def auto_close_expired_opportunities():
	"""Scheduled task: Auto-close all opportunities with past closing dates."""
	opportunities = frappe.get_all(
		"Opportunity",
		filters={
			"status": "Open",
			"closed_on": ["<", nowdate()],

		},
		fields=["name"],
	)

	for opp in opportunities:
		frappe.db.set_value("Opportunity", opp.name, "status", "Closed", update_modified=False)

	if opportunities:
		frappe.db.commit()
		frappe.logger().info(f"Auto-closed {len(opportunities)} expired opportunities")


def test():
	frappe.msgprint("I am working")
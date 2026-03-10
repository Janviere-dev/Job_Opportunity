// Copyright (c) 2026, Red Cross Nairobi and contributors
// For license information, please see license.txt

frappe.ui.form.on("Opportunity post", {
	refresh(frm) {

        frm.set_query("posts", function(){
            return{
                filters:{status: "Open"}
        }
     })
	},
});

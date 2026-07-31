console.log("script is connected");
let expenses=JSON.parse(localStorage.getItem("expenses")) || [];
const heading=document.querySelector("h1");
console.log(heading);
heading.textContent = "Expense Tracker (JS is working!)";
const form=document.querySelector("form");
const expenseList=document.querySelector("#expense-list");
const filterSelect=document.querySelector("#filter-category");
filterSelect.addEventListener("change",renderExpenses);
form.addEventListener("submit",function(event){
    event.preventDefault();
    console.log("form submitted!");
    const amount=document.querySelector('input[type="number"]').value;
    const category=document.querySelector("select").value;
    const date=document.querySelector('input[type="date"]').value;
    const note=document.querySelector('input[type="text"]').value;
    console.log(amount);
    expenses.push({amount:amount, category:category, date:date, note:note});
    localStorage.setItem("expenses",JSON.stringify(expenses));
    console.log(expenses);
    renderExpenses();
    form.reset();
});
function renderExpenses(){
    expenseList.innerHTML="";
    let total=0;
    expenses.forEach(function(expense){
        total+=Number(expense.amount);
    })
    document.querySelector("#total").textContent="Total: ₹"+total;
    const selected=filterSelect.value;
    const filtered=selected=="all"?expenses:expenses.filter(e=>e.category===selected);
    filtered.forEach(function(expense){
        const item=document.createElement("div");
        item.textContent=expense.date+" | "+expense.category+" | ₹"+expense.amount+" | "+expense.note;
        const deleteBtn=document.createElement("button");
        deleteBtn.textContent="Delete";
        deleteBtn.addEventListener("click",function(){
            expenses.splice(expenses.indexOf(expense),1);
            localStorage.setItem("expenses",JSON.stringify(expenses));
            renderExpenses();
        });
        item.appendChild(deleteBtn);
        expenseList.appendChild(item);
    })
}
renderExpenses();
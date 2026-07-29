console.log("script is connected");
let expenses=[];
const heading=document.querySelector("h1");
console.log(heading);
heading.textContent = "Expense Tracker (JS is working!)";
const form=document.querySelector("form");
form.addEventListener("submit",function(event){
    event.preventDefault();
    console.log("form submitted!");
    const amount=document.querySelector('input[type="number"]').value;
    console.log(amount);
    expenses.push({amount:amount});
    console.log(expenses);
});
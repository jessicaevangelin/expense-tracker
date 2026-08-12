console.log("script is connected");
let expenses=[];
const heading=document.querySelector("h1");
console.log(heading);
const form=document.querySelector("form");
const expenseList=document.querySelector("#expense-list");
const filterSelect=document.querySelector("#filter-category");
filterSelect.addEventListener("change",renderExpenses);
window.signInAnonymously(window.auth).catch(function(error){
    console.error("Auth error:",error);
});
window.onAuthStateChanged(window.auth,function(user){
    if (user){
        window.currentUserId=user.uid;
        console.log("Signed in as: ",window.currentUserId);
        listenForExpenses();
    }
});
async function addExpenseToFirestore(expense){
    try{
        await addDoc(window.expensesRef,{...expense,userId:window.currentUserId});
        console.log("Expense saved to Firestore!");
    }catch (error){
        console.error("Error adding expense:",error);
    }
}
async function deleteExpenseFromFirestore(id) {
    try{
        await window.deleteDoc(window.doc(window.db,"expenses",id));
        console.log("Expense deleted!")
    }
    catch (error){
        console.error("Error deleting expense",error);
    }
}
function listenForExpenses(){
    const q=window.query(window.expensesRef,window.where("userId","==",window.currentUserId));
    window.onSnapshot(q,function(snapshot){
        expenses=[];
        snapshot.forEach(function(docSnap){
            expenses.push({id:docSnap.id,...docSnap.data()});
        });
        renderExpenses();
    });
}
form.addEventListener("submit",function(event){
    event.preventDefault();
    console.log("form submitted!");
    const amount=document.querySelector('input[type="number"]').value;
    const category=document.querySelector("select").value;
    const date=document.querySelector('input[type="date"]').value;
    const note=document.querySelector('input[type="text"]').value;
    console.log(amount);
    const expense={amount:amount, category:category, date:date, note:note}
    expenses.push(expense);
    //localStorage.setItem("expenses",JSON.stringify(expenses));
    addExpenseToFirestore(expense);
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
        const dateParts=expense.date.split("-");
        const formattedDate=dateParts[2]+"-"+dateParts[1]+"-"+dateParts[0];
        item.textContent=formattedDate+" | "+expense.category+" | ₹"+expense.amount+" | "+expense.note;
        const deleteBtn=document.createElement("button");
        deleteBtn.textContent="Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click",function(){
            deleteExpenseFromFirestore(expense.id);
        });
        item.appendChild(deleteBtn);
        expenseList.appendChild(item);
    })
}
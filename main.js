import axios from "axios"
let baseUrl = 'http://localhost:5050'
const empties = document.querySelectorAll('[data-cont]')
let temp_id
let temp = []
function reload(arr) {
   empties.forEach(q => {
      q.querySelectorAll('.item').forEach(p => {
         p.remove();
      })
   })
   for (let todo of arr) {
      let div = document.createElement('div')
      let b = document.createElement('b')
      let p = document.createElement('p')
      let div2 = document.createElement('div');

      div2.classList.add('populs');
      for (let el of todo.humans) {
         div2.innerHTML += `
         <div class="humans-box__item" data-name="${el}"><img src="/images/${el}.png"></div>`
      }
      div.setAttribute('id', todo.id)
      div.setAttribute('class', 'item')
      div.setAttribute('draggable', true)

      b.innerHTML = todo.title
      p.innerHTML = todo.description

      div.append(b, p, div2)
      empties.forEach((e, i) => {
         console.log(e.dataset.cont, todo.portal);

         if (e.dataset.cont === todo.portal) {

            empties[i].append(div)
         }
      })

      temp.push(div)


      div.ondragstart = () => {
         temp_id = todo.id
         div.classList.add('hold')
         setTimeout(() => (div.className = 'invisible'), 0)
      }
      div.ondragend = () => {
         div.className = 'item'
      }
   }
   for (let empty of empties) {
      empty.ondragover = (event) => {
         event.preventDefault()
      }
      empty.ondragenter = function (event) {
         event.preventDefault()
         this.className += ' hovered'
      }
      empty.ondragleave = function () {
         this.classList.remove('hovered')
      }
      empty.ondrop = function () {
         this.classList.remove('hovered')
         temp.forEach((item, index) => {
            if (item.id === temp_id) {
               this.append(item);
               axios.patch(baseUrl + '/todos/' + item.id, { portal: this.dataset.cont })
            }
         })
      }
   }
}
axios.get(baseUrl + '/todos')
   .then(res => reload(res.data))

let modal = document.querySelector('.modal')
let openBtns = document.querySelectorAll('[data-modal]')
let closeBtns = document.querySelectorAll('[data-close]')


openBtns.forEach((btn) => {
   btn.onclick = () => {
      modal.classList.add('show', 'fade')
   }
})

closeBtns.forEach((btn) => {
   btn.onclick = () => {
      modal.classList.remove('show', 'fade')
   }
})



// shavkat
let form = document.forms.reg;
let input = document.querySelector('[data-input]');
let h_box = document.querySelector('.humans-box')
form.onsubmit = (e) => {
   e.preventDefault();
   let fm = new FormData(form);
   let obj = {};
   let b = false
   fm.forEach((value, name) => {
      if (value) {
         obj[name] = value;
      } else {
         b = true
      }
   })
   let allDiv = h_box.querySelectorAll('.humans-box__item');
   let bu = [];
   allDiv.forEach(el => {
      bu.push(el.dataset.name);
   })
   if (!b && bu.length) {
      obj.id = `${Math.random()}`
      obj.humans = bu;
      axios.post(baseUrl + '/todos', obj)
         .then(res => {
            if (res.status === 200 || res.status === 201) {
               alert('Тебе повезло))!');
            } else {
               alert('инет проверь))!')
            }
            axios.get(baseUrl + '/todos')
               .then(res => reload(res.data))
            modal.classList.remove('show', 'fade')
         })
   }
}
let map = ["Shavkat", "РАБотница", "РАБотник"]
input.onchange = () => {
   if (!input.value && !map.includes(input.value)) {
      return
   }
   let allDiv = h_box.querySelectorAll('.humans-box__item');
   let b = true;
   allDiv.forEach(el => {
      if (el.dataset.name === input.value) {
         b = false
      }
   })
   if (!b) {
      input.value = '';
      return
   };

   let div = document.createElement('div');
   let img = document.createElement('img');
   let close = document.createElement('div');

   //style
   div.classList.add('humans-box__item');
   close.classList.add('humans-box__close');

   //inner
   img.src = `/images/${input.value}.png`;
   close.innerHTML = "&times;";
   div.dataset.name = input.value;
   div.append(img, close);
   h_box.append(div);
   input.value = '';
   close.onclick = () => {
      div.remove();
   }
}

import {  useEffect, useState, useRef } from "react";

const ScrollableTabs = () => {
    const [count, setCount] = useState(4)
    //by default 3 tabs
    const [tabs_arr, setTabs] = useState([{ id : 1 , content : "this is content of tab1"}, { id : 2 , content : "this is content of tab2"}, { id : 3 , content : "this is content of tab3"}]);
    const scrollTab = useRef(null);
    const [delindex, setDelIndex] = useState(-1);  //initially delete index is -1

    //check if the length of tabs array is less than 3 i.e visible area when the component renders
    useEffect( () => {
        if(tabs_arr.length <= 3){
            document.querySelector('#lc').style.display = 'none';
            document.querySelector('#rc').style.display = 'none';
        }
        else{
            document.querySelector('#lc').style.display = 'inline-block';
            document.querySelector('#rc').style.display = 'inline-block';
        }
    },[tabs_arr])

    //show contents of a tab
    const showContent = (index) => {
        document.getElementById('tab-content').innerText = tabs_arr[index].content;
        //if first tab is selected display left chevron
        if (index == 0){
            document.querySelector('#lc').style.display = 'none';
        }
        //if right tab is selected display right chevron
        else if(index == tabs_arr.length-1){
            document.querySelector('#rc').style.display = 'none';
        }
        //else back to normal
        else if(tabs_arr.length > 3){
            document.querySelector('#lc').style.display = 'inline-block';
            document.querySelector('#rc').style.display = 'inline-block';
        }
    }

    //scroll left using left chevron
    const scrollLeft = () => {
        scrollTab.current.scrollLeft-=200
    }

    //scroll right using right chevron
    const scrollRight = () => {
        scrollTab.current.scrollLeft+=200
    }

    //when drag starts
    const dragStart = (e) => {
        const container = document.querySelector(".tabs-list");
        document.getElementById(e.target.id).classList.add("dragging");
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientX);
            const draggable = document.querySelector(".dragging");
            if (afterElement == null){
                container.appendChild(draggable);
            }
            else{
                container.insertBefore(draggable, afterElement);
            }
        })
    }

    //used inside dragStart to get the after element
    const getDragAfterElement = (container, x) => {
        const draggableElements = [...container.querySelectorAll('.tabs:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - (box.left + (box.width / 2));
            if (offset < 0){
                return { offset : offset, element : child}
            }
            else {
                return closest
            }
        }, { offset: Number.POSITIVE_INFINITY}).element
    }

    //update tabs array once drag ends
    const dragEnd = (e) => {
        //on drag-end
        document.getElementById(e.target.id).classList.remove("dragging");
        const container = document.querySelector(".tabs-list");
        const draggables = container.querySelectorAll('.tabs');
        let tabs = [];
        for (let i=0;i<draggables.length;i++){
            tabs_arr.forEach( (tab) => {
            return tab.id == draggables[i].id ? tabs.push(tab) : null
            })
        }
        setTabs([...tabs]);
    }

    //add a tab, max no. 10
    const addTab = () => {
        let tabs = [];
        tabs = tabs_arr;
        if (tabs.length < 10){
            let tab = {
                id : count,
                content:`this is content of tab${count}`
            }
            tabs.push(tab);
            let cnt = count+1;
            setCount(cnt);
        }
        else{
            alert("tabs are already 10 in number")
        }
        setTabs([...tabs]);
    }

    //remove the tab from tabs array after confirmation
    const removeTab = () => {
        let index = delindex; //delindex keeps a record of index of tab to be removed
        if (index >= 0){
            let tabs = [];
            tabs = tabs_arr;
            tabs = tabs.filter ((tab, ind) => ind!=index);
            if(tabs.length > 0){  //only set tabs if length is atleast one
                setTabs([...tabs]);
            }
        }
        document.getElementById('modal').style.display='none';
    }

    //toggle modal as an alert
    const showModal = (index) =>{
        setDelIndex(index);
        document.getElementById('modal').style.display='block';
        document.getElementById('modal').style.zIndex='200';
    }

    //for onclose and cancel
    const onClose = () => {
        document.getElementById('modal').style.display='none';
        if (delindex >= 0){
            setDelIndex(-1);
        }
    }

    return (
        <div className="container">
        <div className="tabs-container" id="tc">
            <div id="lc" onClick={scrollLeft}><i className="fa fa-chevron-left"></i></div>
            <ul className="tabs-list" id="tl" ref={scrollTab}>
                {tabs_arr.map((tab, index) => {
                    return <li className="tabs" draggable = "true" id={tab.id} key={tab.id} onDragStart={dragStart} onDragEnd={dragEnd}><div className="tab" onClick={() => (showContent(index))}>Tab-{tab.id}</div><span className="fa fa-times" onClick={() => showModal(index)}></span></li>
                })}
            </ul>
            <div id="rc" onClick={scrollRight}><i className="arrow fa fa-chevron-right"></i></div>
            <div id="add"><i className="fa fa-plus" aria-hidden="true" onClick={addTab}></i></div>
        </div>
        <div id="tab-content"></div>
        <div id="modal" className="w3-modal">
            <div className="w3-modal-content">
                <div className="w3-container">
                <button onClick={onClose}>&times;</button>
                <h4>Delete Tab</h4>
                <p>Are you sure you wish to remove tab?</p>
                <span><button id="confirm" type="button" onClick={removeTab}>Ok</button></span>
                <span><button id="cancel" type="button" onClick={onClose}>Cancel</button></span>
                </div>
            </div>
            </div>
        </div>
    )
}

export default ScrollableTabs
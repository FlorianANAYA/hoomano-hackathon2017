/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Joke(joke)
{
    this.m_joke = joke;
}

Joke.prototype.m_joke;
Joke.prototype.m_mark = 0;
Joke.prototype.m_nbMarks = 0;


Joke.prototype.AddMark = function(mark)
{
    if (typeof mark === "number")
    {
        this.m_mark += mark;
        this.m_nbMarks++;
    }
};

Joke.prototype.GetAverage = function()
{
    if (this.m_nbMarks === 0)
        return 0.5;
    else
        return this.m_mark / this.m_nbMarks;
};
